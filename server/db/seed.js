import { pool } from './pool.js'
import { hashPassword } from '../auth.js'

const DEMO_USERNAME = 'bookworm'
const DEMO_PASSWORD = 'readmore123'

const books = [
  ['Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling',
    'An orphaned boy learns on his eleventh birthday that he is a wizard, and is swept off to a school where nothing is what it seems.',
    'finished', 5, 'Comfort reread.', '2026-01-12'],
  ['Percy Jackson and the Lightning Thief', 'Rick Riordan',
    'A troubled twelve-year-old discovers he is the son of a Greek god and is accused of stealing a weapon he never took.',
    'reading', 4, '', '2026-01-13'],
  ['When Cats Disappear from the World', 'Genki Kawamura',
    'A dying postman strikes a bargain with the devil, erasing one thing from the world for every extra day of life, and has to decide what he can live without.',
    'want-to-read', 0, '', '2026-01-14'],
  ['No Longer Human', 'Osamu Dazai',
    'A man who has never understood how to be human narrates his slow disintegration from childhood performance to total isolation.',
    'dropped', 2, 'Too bleak for right now.', '2026-01-15'],
]

try {
  await pool.query('DELETE FROM profile WHERE lower(username) = $1', [DEMO_USERNAME])

  const created = await pool.query(
    `INSERT INTO profile (username, password_hash, bio, created_at)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [DEMO_USERNAME, hashPassword(DEMO_PASSWORD), 'Mostly dark academia and fantasy. Always slightly behind on my shelf.', '2026-01-12']
  )
  const profileId = created.rows[0].id

  for (const [title, author, blurb, status, rating, notes, createdAt] of books) {
    await pool.query(
      `INSERT INTO books (profile_id, title, author, blurb, status, rating, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [profileId, title, author, blurb, status, rating, notes, createdAt]
    )
  }
  console.log(`seeded demo account "${DEMO_USERNAME}" with ${books.length} books`)
} catch (error) {
  console.error(`seed failed: ${error.message}`)
  process.exitCode = 1
} finally {
  await pool.end()
}
