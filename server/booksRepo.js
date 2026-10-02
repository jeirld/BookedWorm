export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function create(pool, { title, author, blurb, status, rating, notes }) {
  const result = await pool.query(
    `INSERT INTO books (title, author, blurb, status, rating, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, author, blurb ?? '', status, rating ?? 0, notes ?? '']
  )
  return result.rows[0]
}

export async function update(pool, id, changes) {
  const current = await getById(pool, id)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE books
     SET title = $1, author = $2, blurb = $3, status = $4, rating = $5, notes = $6
     WHERE id = $7
     RETURNING *`,
    [merged.title, merged.author, merged.blurb, merged.status, merged.rating, merged.notes, id]
  )
  return result.rows[0]
}

export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING id', [id])
  return result.rowCount > 0
}
