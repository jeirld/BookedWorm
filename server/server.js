import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as books from './booksRepo.js'
import * as notes from './notesRepo.js'
import * as profile from './profileRepo.js'
import { hashPassword, checkLogin, startSession, endSession, tokenFrom, requireAuth } from './auth.js'

const app = express()
app.set('trust proxy', 1)

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

const attempts = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 20

function limitAuthAttempts(request, response, next) {
  const now = Date.now()
  const entry = attempts.get(request.ip)
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(request.ip, { start: now, count: 1 })
    return next()
  }
  entry.count += 1
  if (entry.count > MAX_ATTEMPTS) {
    return response.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' })
  }
  next()
}

app.param('id', (request, response, next, id) => {
  if (!/^\d+$/.test(id)) return response.status(404).json({ error: 'Not found' })
  next()
})

const STATUSES = ['want-to-read', 'reading', 'finished', 'dropped']

function validateCredentials(body) {
  const errors = []
  const username = typeof body.username === 'string' ? body.username.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (username.length < 3 || username.length > 30) errors.push('username must be 3 to 30 characters')
  if (!/^[A-Za-z0-9_.-]*$/.test(username)) {
    errors.push('username can only use letters, numbers, dots, dashes and underscores')
  }
  if (password.length < 8) errors.push('password must be at least 8 characters')
  if (password.length > 100) errors.push('password must be 100 characters or fewer')

  return { errors, value: { username, password } }
}

function validateBook(body, defaults) {
  const errors = []
  const title = typeof body.title === 'string' ? body.title.trim() : defaults.title
  const author = typeof body.author === 'string' ? body.author.trim() : defaults.author
  const blurb = typeof body.blurb === 'string' ? body.blurb.trim() : defaults.blurb
  const status = typeof body.status === 'string' ? body.status : defaults.status
  const rating = body.rating === undefined ? defaults.rating : Number(body.rating)
  const notesText = typeof body.notes === 'string' ? body.notes.trim() : defaults.notes

  if (!title) errors.push('title is required')
  if (title.length > 200) errors.push('title must be 200 characters or fewer')
  if (!author) errors.push('author is required')
  if (author.length > 200) errors.push('author must be 200 characters or fewer')
  if (blurb.length > 2000) errors.push('blurb must be 2000 characters or fewer')
  if (!STATUSES.includes(status)) errors.push(`status must be one of: ${STATUSES.join(', ')}`)
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    errors.push('rating must be a whole number from 0 to 5')
  }
  if (notesText.length > 2000) errors.push('notes must be 2000 characters or fewer')

  return { errors, value: { title, author, blurb, status, rating, notes: notesText } }
}

function validateNote(body, defaults) {
  const errors = []
  const bookId = body.bookId === undefined ? defaults.bookId : Number(body.bookId)
  const title = typeof body.title === 'string' ? body.title.trim() : defaults.title
  const noteBody = typeof body.body === 'string' ? body.body.trim() : defaults.body
  const date = typeof body.date === 'string' && body.date ? body.date : defaults.date

  if (!Number.isInteger(bookId)) errors.push('bookId is required')
  if (!title) errors.push('title is required')
  if (title.length > 200) errors.push('title must be 200 characters or fewer')
  if (noteBody.length > 5000) errors.push('body must be 5000 characters or fewer')
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('date must be in YYYY-MM-DD format')

  return { errors, value: { bookId, title, body: noteBody, date } }
}

function validateProfile(body, defaults) {
  const errors = []
  const username = typeof body.username === 'string' ? body.username.trim() : defaults.username
  const bio = typeof body.bio === 'string' ? body.bio.trim() : defaults.bio

  if (username.length < 3 || username.length > 30) errors.push('username must be 3 to 30 characters')
  if (!/^[A-Za-z0-9_.-]*$/.test(username)) {
    errors.push('username can only use letters, numbers, dots, dashes and underscores')
  }
  if (bio.length > 2000) errors.push('bio must be 2000 characters or fewer')

  return { errors, value: { username, bio } }
}

app.post('/api/auth/register', limitAuthAttempts, async (request, response, next) => {
  const { errors, value } = validateCredentials(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const created = await profile.create(pool, {
      username: value.username,
      passwordHash: hashPassword(value.password),
    })
    response.status(201).json({ token: await startSession(created.id), profile: created })
  } catch (error) {
    if (error.code === '23505') return response.status(409).json({ error: 'That username is already taken' })
    next(error)
  }
})

app.post('/api/auth/login', limitAuthAttempts, async (request, response, next) => {
  const username = typeof request.body?.username === 'string' ? request.body.username.trim() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''

  try {
    const account = await profile.getLoginByUsername(pool, username)
    if (!checkLogin(password, account?.passwordHash)) {
      return response.status(401).json({ error: 'Wrong username or password' })
    }
    const { passwordHash, ...publicProfile } = account
    response.json({ token: await startSession(account.id), profile: publicProfile })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/logout', requireAuth, async (request, response, next) => {
  try {
    await endSession(tokenFrom(request))
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api/books', requireAuth)
app.use('/api/notes', requireAuth)
app.use('/api/profile', requireAuth)

app.get('/api/books', async (request, response, next) => {
  try {
    response.json(await books.getAll(pool, request.profileId))
  } catch (error) {
    next(error)
  }
})

app.get('/api/books/:id', async (request, response, next) => {
  try {
    const row = await books.getById(pool, request.profileId, request.params.id)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.post('/api/books', async (request, response, next) => {
  const defaults = { title: '', author: '', blurb: '', status: 'want-to-read', rating: 0, notes: '' }
  const { errors, value } = validateBook(request.body ?? {}, defaults)
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await books.create(pool, request.profileId, value))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/books/:id', async (request, response, next) => {
  try {
    const current = await books.getById(pool, request.profileId, request.params.id)
    if (!current) return response.status(404).json({ error: 'Not found' })

    const { errors, value } = validateBook(request.body ?? {}, current)
    if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

    response.json(await books.update(pool, request.profileId, request.params.id, value))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/books/:id', async (request, response, next) => {
  try {
    const removed = await books.remove(pool, request.profileId, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.get('/api/notes', async (request, response, next) => {
  try {
    response.json(await notes.getAll(pool, request.profileId))
  } catch (error) {
    next(error)
  }
})

app.post('/api/notes', async (request, response, next) => {
  const defaults = { bookId: undefined, title: '', body: '', date: undefined }
  const { errors, value } = validateNote(request.body ?? {}, defaults)
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    if (!(await notes.ownsBook(pool, request.profileId, value.bookId))) {
      return response.status(400).json({ error: 'bookId does not match a book' })
    }
    response.status(201).json(await notes.create(pool, value))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/notes/:id', async (request, response, next) => {
  try {
    const current = await notes.getById(pool, request.profileId, request.params.id)
    if (!current) return response.status(404).json({ error: 'Not found' })

    const { errors, value } = validateNote(request.body ?? {}, current)
    if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

    if (!(await notes.ownsBook(pool, request.profileId, value.bookId))) {
      return response.status(400).json({ error: 'bookId does not match a book' })
    }
    response.json(await notes.update(pool, request.profileId, request.params.id, value))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const removed = await notes.remove(pool, request.profileId, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.get('/api/profile', async (request, response, next) => {
  try {
    const row = await profile.getById(pool, request.profileId)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.patch('/api/profile', async (request, response, next) => {
  try {
    const current = await profile.getById(pool, request.profileId)
    if (!current) return response.status(404).json({ error: 'Not found' })

    const { errors, value } = validateProfile(request.body ?? {}, current)
    if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

    response.json(await profile.update(pool, request.profileId, value))
  } catch (error) {
    if (error.code === '23505') return response.status(409).json({ error: 'That username is already taken' })
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})
