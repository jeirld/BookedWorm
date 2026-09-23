// The real client. Every function here talks to YOUR Express API.
//
// This is the file that matters for the finals project. mockApi.js exists so
// the interface can be built before this has anywhere to point. Increment 2
// implements the server these paths expect: GET/POST /api/books,
// GET/PATCH/DELETE /api/books/:id, and the same shape for /api/notes and the
// single-row /api/profile (see CLAUDE.md).
//
// PATCH, not PUT: Book details' Save and the star rating both send a
// partial update (just { status, rating }), never the whole book, so PATCH
// is the honest verb for what this app actually does.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    // Try to use the API's own message; fall back to the status line.
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// ---- Books ----------------------------------------------------------------

export const listBooks = () => request('/api/books')

export const getBook = (id) => request(`/api/books/${id}`)

export const createBook = (input) =>
  request('/api/books', { method: 'POST', body: JSON.stringify(input) })

export const updateBook = (id, input) =>
  request(`/api/books/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteBook = (id) => request(`/api/books/${id}`, { method: 'DELETE' })

// ---- Notes ------------------------------------------------------------------

export const listNotes = () => request('/api/notes')

export const createNote = (input) =>
  request('/api/notes', { method: 'POST', body: JSON.stringify(input) })

export const updateNote = (id, input) =>
  request(`/api/notes/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteNote = (id) => request(`/api/notes/${id}`, { method: 'DELETE' })

// ---- Profile (a single row, no login yet) ------------------------------------

export const getProfile = () => request('/api/profile')

export const updateProfile = (input) =>
  request('/api/profile', { method: 'PATCH', body: JSON.stringify(input) })
