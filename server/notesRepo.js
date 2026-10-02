const COLUMNS = `id, book_id AS "bookId", title, body, note_date AS "date"`

export async function getAll(pool) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM notes ORDER BY note_date DESC, id DESC`)
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM notes WHERE id = $1`, [id])
  return result.rows[0] ?? null
}

export async function create(pool, { bookId, title, body, date }) {
  const result = await pool.query(
    `INSERT INTO notes (book_id, title, body, note_date)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
     RETURNING ${COLUMNS}`,
    [bookId, title, body ?? '', date ?? null]
  )
  return result.rows[0]
}

export async function update(pool, id, changes) {
  const current = await getById(pool, id)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE notes
     SET book_id = $1, title = $2, body = $3, note_date = $4
     WHERE id = $5
     RETURNING ${COLUMNS}`,
    [merged.bookId, merged.title, merged.body, merged.date, id]
  )
  return result.rows[0]
}

export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING id', [id])
  return result.rowCount > 0
}
