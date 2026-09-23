import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Shelf from './pages/Shelf.jsx'
import BookDetails from './pages/BookDetails.jsx'
import AddBook from './pages/AddBook.jsx'
import Notes from './pages/Notes.jsx'
import NewNote from './pages/NewNote.jsx'
import Account from './pages/Account.jsx'
import * as api from './api/index.js'

// The three tabs BottomNav links to. Header has no back button on
// these (there's nowhere sensible to go "back" from a tab), but every
// other screen (Shelf, Book details, Add book, New note) is reached by
// drilling in from one of these, so it gets one.
const ROOT_ROUTES = ['/', '/notes', '/account']

// Shared layout: Header, then the page (<Outlet>), then BottomNav.
// Each page tells the layout its title via the route's `handle`, but for
// Increment 1 we keep it simple and let each page render its own <h1>
// inside <main>; Header stays generic here.
function Layout() {
  const location = useLocation()
  const isRootScreen = ROOT_ROUTES.includes(location.pathname)

  return (
    <>
      <Header title="Booked Worm" onBack={isRootScreen ? null : undefined} />
      {/* BottomNav is fixed to the viewport (see BottomNav.module.css),
          so main needs its own clearance at the bottom -- otherwise the
          nav bar would sit on top of the last bit of content. */}
      <main className="page" style={{ paddingBottom: 'calc(var(--nav-height) + var(--space-4) + env(safe-area-inset-bottom))' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

// Shown in place of the real routes while the first load is in flight
// (src/api's mock implementation adds an artificial 250ms delay for
// exactly this reason -- a real network is never instant, so this
// screen has to exist rather than being discovered later against a
// real API).
function LoadingScreen() {
  return (
    <section className="section">
      <div className="panel">
        <p className="muted">Loading your shelf...</p>
      </div>
    </section>
  )
}

export default function App() {
  // Both books and notes live here, at the top of the tree, and get
  // passed down as props. This is the fix for the proposal's one risk:
  // updateBook always replaces the matching book with the server's
  // response inside a NEW array (via .map), so React sees the change
  // and re-renders correctly no matter which screen (Book details'
  // Save, or the star rating) called it.
  //
  // null (not []) means "hasn't loaded yet" -- see LoadingScreen above.
  const [books, setBooks] = useState(null)
  const [notes, setNotes] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.listBooks(), api.listNotes(), api.getProfile()]).then(
      ([booksResult, notesResult, profileResult]) => {
        if (cancelled) return
        setBooks(booksResult)
        setNotes(notesResult)
        setProfile(profileResult)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  async function updateBook(id, changes) {
    const updated = await api.updateBook(id, changes)
    setBooks((prev) => prev.map((book) => (book.id === id ? updated : book)))
  }

  async function addBook(book) {
    const created = await api.createBook(book)
    setBooks((prev) => [...prev, created])
    return created.id
  }

  async function addNote(note) {
    const created = await api.createNote(note)
    setNotes((prev) => [...prev, created])
    return created.id
  }

  async function updateNote(id, changes) {
    const updated = await api.updateNote(id, changes)
    setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)))
  }

  async function updateProfile(changes) {
    const updated = await api.updateProfile(changes)
    setProfile(updated)
  }

  const loading = books === null || notes === null || profile === null

  return (
    <Routes>
      <Route element={<Layout />}>
        {loading ? (
          <Route path="*" element={<LoadingScreen />} />
        ) : (
          <>
            <Route path="/" element={<Home books={books} />} />
            <Route path="/shelf/:status" element={<Shelf books={books} />} />
            <Route path="/books/new" element={<AddBook addBook={addBook} />} />
            <Route
              path="/books/:id"
              element={<BookDetails books={books} updateBook={updateBook} />}
            />
            <Route
              path="/notes"
              element={<Notes notes={notes} books={books} updateNote={updateNote} />}
            />
            <Route path="/notes/new" element={<NewNote books={books} addNote={addNote} />} />
            <Route
              path="/account"
              element={<Account profile={profile} updateProfile={updateProfile} books={books} />}
            />
          </>
        )}
      </Route>
    </Routes>
  )
}
