import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Shelf from './pages/Shelf.jsx'
import BookDetails from './pages/BookDetails.jsx'
import AddBook from './pages/AddBook.jsx'
import Notes from './pages/Notes.jsx'
import NewNote from './pages/NewNote.jsx'
import Account from './pages/Account.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import * as api from './api/index.js'
import { SIGNED_OUT_EVENT } from './api/events.js'

const ROOT_ROUTES = ['/', '/notes', '/account']

function Layout() {
  const location = useLocation()
  const isRootScreen = ROOT_ROUTES.includes(location.pathname)

  return (
    <>
      <Header title="Booked Worm" onBack={isRootScreen ? null : undefined} />
      <main className="page" style={{ paddingBottom: 'calc(var(--nav-height) + var(--space-4) + env(safe-area-inset-bottom))' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

function AuthLayout() {
  return (
    <>
      <Header title="Booked Worm" onBack={null} />
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}

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
  // null means "not loaded yet", as opposed to an empty list.
  const [books, setBooks] = useState(null)
  const [notes, setNotes] = useState(null)
  const [profile, setProfile] = useState(null)
  const [signedIn, setSignedIn] = useState(() => api.hasSession())
  const navigate = useNavigate()

  function clearSession() {
    setBooks(null)
    setNotes(null)
    setProfile(null)
    setSignedIn(false)
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    window.addEventListener(SIGNED_OUT_EVENT, clearSession)
    return () => window.removeEventListener(SIGNED_OUT_EVENT, clearSession)
  })

  useEffect(() => {
    if (!signedIn) return
    let cancelled = false
    Promise.all([api.listBooks(), api.listNotes(), api.getProfile()])
      .then(([booksResult, notesResult, profileResult]) => {
        if (cancelled) return
        setBooks(booksResult)
        setNotes(notesResult)
        setProfile(profileResult)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [signedIn])

  async function signup(credentials) {
    await api.register(credentials)
    setSignedIn(true)
    navigate('/', { replace: true })
  }

  async function login(credentials) {
    await api.login(credentials)
    setSignedIn(true)
    navigate('/', { replace: true })
  }

  async function logout() {
    try {
      await api.logout()
    } catch {
    }
    clearSession()
  }

  async function updateBook(id, changes) {
    const updated = await api.updateBook(id, changes)
    setBooks((prev) => prev.map((book) => (book.id === id ? updated : book)))
  }

  async function deleteBook(id) {
    await api.deleteBook(id)
    setBooks((prev) => prev.filter((book) => book.id !== id))
    setNotes((prev) => prev.filter((note) => note.bookId !== id))
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

  async function deleteNote(id) {
    await api.deleteNote(id)
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  async function deleteAccount(password) {
    await api.deleteAccount(password)
    clearSession()
  }

  async function updateProfile(changes) {
    const updated = await api.updateProfile(changes)
    setProfile(updated)
  }

  const loading = books === null || notes === null || profile === null

  if (!signedIn) {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/signup" element={<Signup onSignup={signup} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    )
  }

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
              element={<BookDetails books={books} updateBook={updateBook} deleteBook={deleteBook} />}
            />
            <Route
              path="/notes"
              element={<Notes notes={notes} books={books} updateNote={updateNote} deleteNote={deleteNote} />}
            />
            <Route path="/notes/new" element={<NewNote books={books} addNote={addNote} />} />
            <Route
              path="/account"
              element={<Account profile={profile} updateProfile={updateProfile} onLogout={logout} onDeleteAccount={deleteAccount} />}
            />
          </>
        )}
      </Route>
    </Routes>
  )
}
