import seed from './seed.json'

const USERS_KEY = 'bookedworm:users'
const SESSION_KEY = 'bookedworm:session'

// Demo mode only: passwords sit in plain text in this browser and are never sent anywhere.
const DEMO_USER = { ...seed.profile, password: 'readmore123' }

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(key)
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

function nextId(rows) {
  return rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1
}

function currentUserId() {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) throw new Error('Please log in')
  return Number(id)
}

const readUsers = () => read(USERS_KEY, [DEMO_USER])

const publicProfile = ({ password: _password, ...rest }) => rest

const booksKey = () => `bookedworm:books:${currentUserId()}`
const notesKey = () => `bookedworm:notes:${currentUserId()}`
const readBooks = () => read(booksKey(), currentUserId() === DEMO_USER.id ? seed.books : [])
const readNotes = () => read(notesKey(), currentUserId() === DEMO_USER.id ? seed.notes : [])

function checkUsername(username, users, ownId) {
  if (username.length < 3 || username.length > 30) {
    throw new Error('username must be 3 to 30 characters')
  }
  if (!/^[A-Za-z0-9_.-]+$/.test(username)) {
    throw new Error('username can only use letters, numbers, dots, dashes and underscores')
  }
  const taken = users.some((u) => u.id !== ownId && u.username.toLowerCase() === username.toLowerCase())
  if (taken) throw new Error('That username is already taken')
}

export const hasSession = () => Boolean(localStorage.getItem(SESSION_KEY))

export async function register({ username, password }) {
  await delay()
  const users = readUsers()
  const name = username.trim()
  checkUsername(name, users, null)
  if (password.length < 8) throw new Error('password must be at least 8 characters')

  const created = {
    id: nextId(users),
    username: name,
    password,
    bio: '',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  write(USERS_KEY, [...users, created])
  localStorage.setItem(SESSION_KEY, String(created.id))
  return publicProfile(created)
}

export async function login({ username, password }) {
  await delay()
  const found = readUsers().find((u) => u.username.toLowerCase() === username.trim().toLowerCase())
  if (!found || found.password !== password) throw new Error('Wrong username or password')
  localStorage.setItem(SESSION_KEY, String(found.id))
  return publicProfile(found)
}

export async function logout() {
  await delay()
  localStorage.removeItem(SESSION_KEY)
}

export async function listBooks() {
  await delay()
  return readBooks()
}

export async function getBook(id) {
  await delay()
  const found = readBooks().find((row) => row.id === Number(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function createBook(input) {
  await delay()
  const rows = readBooks()
  const created = {
    rating: 0,
    notes: '',
    ...input,
    id: nextId(rows),
    created_at: new Date().toISOString(),
  }
  write(booksKey(), [...rows, created])
  return created
}

export async function updateBook(id, input) {
  await delay()
  const rows = readBooks()
  const index = rows.findIndex((row) => row.id === Number(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(booksKey(), rows)
  return rows[index]
}

export async function deleteBook(id) {
  await delay()
  write(booksKey(), readBooks().filter((row) => row.id !== Number(id)))
  write(notesKey(), readNotes().filter((row) => row.bookId !== Number(id)))
}

export async function searchBooks(term) {
  await delay()
  const text = term.trim().toLowerCase()
  return readBooks().filter(
    (book) => book.title.toLowerCase().includes(text) || book.author.toLowerCase().includes(text)
  )
}

export async function getStats() {
  await delay()
  const counts = { 'want-to-read': 0, reading: 0, finished: 0, dropped: 0 }
  for (const book of readBooks()) counts[book.status] += 1
  return counts
}

export async function listNotes() {
  await delay()
  return readNotes()
}

export async function createNote(input) {
  await delay()
  const rows = readNotes()
  const created = { ...input, id: nextId(rows) }
  write(notesKey(), [...rows, created])
  return created
}

export async function updateNote(id, input) {
  await delay()
  const rows = readNotes()
  const index = rows.findIndex((row) => row.id === Number(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(notesKey(), rows)
  return rows[index]
}

export async function deleteNote(id) {
  await delay()
  write(notesKey(), readNotes().filter((row) => row.id !== Number(id)))
}

export async function getProfile() {
  await delay()
  const found = readUsers().find((u) => u.id === currentUserId())
  return publicProfile(found)
}

export async function updateProfile(input) {
  await delay()
  const users = readUsers()
  const index = users.findIndex((u) => u.id === currentUserId())
  const next = { ...users[index], ...input }
  checkUsername(next.username, users, next.id)
  users[index] = next
  write(USERS_KEY, users)
  return publicProfile(next)
}

export async function deleteAccount(password) {
  await delay()
  const id = currentUserId()
  const users = readUsers()
  const found = users.find((u) => u.id === id)
  if (found.id === DEMO_USER.id) throw new Error('The demo account cannot be deleted')
  if (found.password !== password) throw new Error('Wrong password')
  write(USERS_KEY, users.filter((u) => u.id !== id))
  localStorage.removeItem(booksKey())
  localStorage.removeItem(notesKey())
  localStorage.removeItem(SESSION_KEY)
}
