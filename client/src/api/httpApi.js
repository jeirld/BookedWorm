import { SIGNED_OUT_EVENT } from './events.js'

const BASE = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'bookedworm:token'

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
  }
}

async function request(path, options) {
  const token = getToken()
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
    }
    if (response.status === 401 && token && !path.startsWith('/api/auth/')) {
      setToken(null)
      window.dispatchEvent(new Event(SIGNED_OUT_EVENT))
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const hasSession = () => Boolean(getToken())

export async function register(input) {
  const result = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(input) })
  setToken(result.token)
  return result.profile
}

export async function login(input) {
  const result = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(input) })
  setToken(result.token)
  return result.profile
}

export async function logout() {
  try {
    await request('/api/auth/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
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
