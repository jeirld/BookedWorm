import { randomBytes, createHash, scryptSync, timingSafeEqual } from 'node:crypto'
import * as sessions from './sessionsRepo.js'
import { pool } from './db/pool.js'

const SESSION_DAYS = 14

export function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(actual, expected)
}

const DUMMY_HASH = hashPassword('not-a-real-password')

// Hashes even for unknown usernames, so response time does not reveal which usernames exist.
export function checkLogin(password, stored) {
  const matches = verifyPassword(password, stored ?? DUMMY_HASH)
  return Boolean(stored) && matches
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export async function startSession(profileId) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await sessions.create(pool, hashToken(token), profileId, expiresAt)
  return token
}

export function tokenFrom(request) {
  const header = request.headers.authorization ?? ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

export async function endSession(token) {
  await sessions.remove(pool, hashToken(token))
}

export async function requireAuth(request, response, next) {
  try {
    const token = tokenFrom(request)
    const profileId = token ? await sessions.findProfileId(pool, hashToken(token)) : null
    if (!profileId) return response.status(401).json({ error: 'Please log in' })
    request.profileId = profileId
    next()
  } catch (error) {
    next(error)
  }
}
