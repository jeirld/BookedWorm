const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listBooks = () => request('/api/books')

export const getBook = (id) => request(`/api/books/${id}`)

export const createBook = (input) =>
  request('/api/books', { method: 'POST', body: JSON.stringify(input) })

export const updateBook = (id, input) =>
  request(`/api/books/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteBook = (id) => request(`/api/books/${id}`, { method: 'DELETE' })

export const listNotes = () => request('/api/notes')

export const createNote = (input) =>
  request('/api/notes', { method: 'POST', body: JSON.stringify(input) })

export const updateNote = (id, input) =>
  request(`/api/notes/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteNote = (id) => request(`/api/notes/${id}`, { method: 'DELETE' })

export const getProfile = () => request('/api/profile')

export const updateProfile = (input) =>
  request('/api/profile', { method: 'PATCH', body: JSON.stringify(input) })
