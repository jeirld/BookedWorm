import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Shelf from './pages/Shelf.jsx'
import BookDetails from './pages/BookDetails.jsx'
import AddBook from './pages/AddBook.jsx'
import Notes from './pages/Notes.jsx'
import NewNote from './pages/NewNote.jsx'
import Account from './pages/Account.jsx'
import { mockBooks, mockProfile } from './data/mockBooks.js'

// Shared layout: Header, then the page (<Outlet>), then BottomNav.
// Each page tells the layout its title via the route's `handle`, but for
// Increment 1 we keep it simple and let each page render its own <h1>
// inside <main>; Header stays generic here.
function Layout() {
  return (
    <>
      <Header title="Booked Worm" onBack={null} />
      <main className="page">
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

export default function App() {
  // Both books and notes live here, at the top of the tree, and get
  // passed down as props. This is the fix for the proposal's one risk:
  // updateBook always returns a NEW array (via .map), replacing only the
  // matching book, so React sees the change and re-renders correctly no
  // matter which screen (Book details' Save, or the star rating) called it.
  const [books, setBooks] = useState(mockBooks)
  const [notes, setNotes] = useState([])
  const [profile, setProfile] = useState(mockProfile)

  function updateBook(id, changes) {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...changes } : book)),
    )
  }

  function addBook(book) {
    const id = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1
    setBooks((prev) => [...prev, { id, rating: 0, notes: '', ...book }])
    return id
  }

  function addNote(note) {
    const id = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1
    setNotes((prev) => [...prev, { id, ...note }])
    return id
  }

  function updateNote(id, changes) {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home books={books} />} />
        <Route path="/shelf/:status" element={<Shelf books={books} />} />
        <Route
          path="/books/new"
          element={<AddBook addBook={addBook} />}
        />
        <Route
          path="/books/:id"
          element={<BookDetails books={books} updateBook={updateBook} />}
        />
        <Route
          path="/notes"
          element={<Notes notes={notes} books={books} updateNote={updateNote} />}
        />
        <Route
          path="/notes/new"
          element={<NewNote books={books} addNote={addNote} />}
        />
        <Route
          path="/account"
          element={<Account profile={profile} setProfile={setProfile} books={books} />}
        />
      </Route>
    </Routes>
  )
}
