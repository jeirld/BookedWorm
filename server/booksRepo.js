export async function getAll(pool, profileId) {
  const result = await pool.query(
    'SELECT * FROM books WHERE profile_id = $1 ORDER BY created_at DESC',
    [profileId]
  )
  return result.rows
}

export async function getById(pool, profileId, id) {
  const result = await pool.query('SELECT * FROM books WHERE id = $1 AND profile_id = $2', [id, profileId])
  return result.rows[0] ?? null
}

export async function create(pool, profileId, { title, author, blurb, status, rating, notes }) {
  const result = await pool.query(
    `INSERT INTO books (profile_id, title, author, blurb, status, rating, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [profileId, title, author, blurb ?? '', status, rating ?? 0, notes ?? '']
  )
  return result.rows[0]
}

export async function update(pool, profileId, id, changes) {
  const current = await getById(pool, profileId, id)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE books
     SET title = $1, author = $2, blurb = $3, status = $4, rating = $5, notes = $6
     WHERE id = $7 AND profile_id = $8
     RETURNING *`,
    [merged.title, merged.author, merged.blurb, merged.status, merged.rating, merged.notes, id, profileId]
  )
  return result.rows[0]
}

export async function remove(pool, profileId, id) {
  const result = await pool.query(
    'DELETE FROM books WHERE id = $1 AND profile_id = $2 RETURNING id',
    [id, profileId]
  )
  return result.rowCount > 0
}
