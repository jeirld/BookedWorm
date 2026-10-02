const COLUMNS = `id, username, bio, created_at AS "createdAt"`

export async function get(pool) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM profile ORDER BY id LIMIT 1`)
  return result.rows[0] ?? null
}

export async function update(pool, changes) {
  const current = await get(pool)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE profile SET username = $1, bio = $2 WHERE id = $3 RETURNING ${COLUMNS}`,
    [merged.username, merged.bio, current.id]
  )
  return result.rows[0]
}
