const COLUMNS = `n.id, n.book_id AS "bookId", n.title, n.body, n.note_date AS "date"`
const RETURNING = `id, book_id AS "bookId", title, body, note_date AS "date"`
const OWNED = 'FROM notes n JOIN books b ON b.id = n.book_id'

export async function getAll(pool, profileId) {
  const result = await pool.query(
    `SELECT ${COLUMNS} ${OWNED} WHERE b.profile_id = $1 ORDER BY n.note_date DESC, n.id DESC`,
    [profileId]
  )
  return result.rows
}

export async function getById(pool, profileId, id) {
  const result = await pool.query(
    `SELECT ${COLUMNS} ${OWNED} WHERE n.id = $1 AND b.profile_id = $2`,
    [id, profileId]
  )
  return result.rows[0] ?? null
}

export async function ownsBook(pool, profileId, bookId) {
  const result = await pool.query('SELECT 1 FROM books WHERE id = $1 AND profile_id = $2', [bookId, profileId])
  return result.rowCount > 0
}

export async function create(pool, { bookId, title, body, date }) {
  const result = await pool.query(
    `INSERT INTO notes (book_id, title, body, note_date)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
     RETURNING ${RETURNING}`,
    [bookId, title, body ?? '', date ?? null]
  )
  return result.rows[0]
}

export async function update(pool, profileId, id, changes) {
  const current = await getById(pool, profileId, id)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE notes
     SET book_id = $1, title = $2, body = $3, note_date = $4
     WHERE id = $5
     RETURNING ${RETURNING}`,
    [merged.bookId, merged.title, merged.body, merged.date, id]
  )
  return result.rows[0]
}

export async function remove(pool, profileId, id) {
  const result = await pool.query(
    `DELETE FROM notes WHERE id = $1
     AND book_id IN (SELECT id FROM books WHERE profile_id = $2)
     RETURNING id`,
    [id, profileId]
  )
  return result.rowCount > 0
}
