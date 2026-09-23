// The simulated backend.
//
// Same function names, same return types, and the same shape of failure as
// httpApi.js, so your components cannot tell the difference. Data lives in
// the visitor's own browser and goes no further.
//
// This exists so the template's GitHub Pages link works on day one and so
// you can build the interface before your API is deployed. It is NOT a
// finished project.
//
// Three resources instead of the template's one: books, notes and a single
// profile row (see CLAUDE.md -- no login yet, so there's exactly one).

import seed from './seed.json'

const BOOKS_KEY = 'bookedworm:books'
const NOTES_KEY = 'bookedworm:notes'
const PROFILE_KEY = 'bookedworm:profile'

// A real network is not instant. Keeping this delay is what forces building
// a loading state now, while it is cheap, instead of discovering the need
// for one the day this switches to the real API.
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Corrupted storage. Start again rather than crashing the app.
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

// ---- Books ------------------------------------------------------------

export async function listBooks() {
  await delay()
  return read(BOOKS_KEY, seed.books)
}

export async function getBook(id) {
  await delay()
  const found = read(BOOKS_KEY, seed.books).find((row) => row.id === Number(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function createBook(input) {
  await delay()
  const rows = read(BOOKS_KEY, seed.books)
  const created = {
    rating: 0,
    notes: '',
    ...input,
    id: nextId(rows),
    created_at: new Date().toISOString(),
  }
  write(BOOKS_KEY, [...rows, created])
  return created
}

export async function updateBook(id, input) {
  await delay()
  const rows = read(BOOKS_KEY, seed.books)
  const index = rows.findIndex((row) => row.id === Number(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(BOOKS_KEY, rows)
  return rows[index]
}

export async function deleteBook(id) {
  await delay()
  write(BOOKS_KEY, read(BOOKS_KEY, seed.books).filter((row) => row.id !== Number(id)))
}

// ---- Notes --------------------------------------------------------------

export async function listNotes() {
  await delay()
  return read(NOTES_KEY, seed.notes)
}

export async function createNote(input) {
  await delay()
  const rows = read(NOTES_KEY, seed.notes)
  const created = { ...input, id: nextId(rows) }
  write(NOTES_KEY, [...rows, created])
  return created
}

export async function updateNote(id, input) {
  await delay()
  const rows = read(NOTES_KEY, seed.notes)
  const index = rows.findIndex((row) => row.id === Number(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(NOTES_KEY, rows)
  return rows[index]
}

export async function deleteNote(id) {
  await delay()
  write(NOTES_KEY, read(NOTES_KEY, seed.notes).filter((row) => row.id !== Number(id)))
}

// ---- Profile (a single row, no login yet) --------------------------------

export async function getProfile() {
  await delay()
  return read(PROFILE_KEY, seed.profile)
}

export async function updateProfile(input) {
  await delay()
  const current = read(PROFILE_KEY, seed.profile)
  const updated = { ...current, ...input }
  write(PROFILE_KEY, updated)
  return updated
}
