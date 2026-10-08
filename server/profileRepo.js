const COLUMNS = `id, username, bio, created_at AS "createdAt"`

export async function getById(pool, id) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM profile WHERE id = $1`, [id])
  return result.rows[0] ?? null
}

export async function getLoginByUsername(pool, username) {
  const result = await pool.query(
    `SELECT ${COLUMNS}, password_hash AS "passwordHash" FROM profile WHERE lower(username) = lower($1)`,
    [username]
  )
  return result.rows[0] ?? null
}

export async function create(pool, { username, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO profile (username, password_hash) VALUES ($1, $2) RETURNING ${COLUMNS}`,
    [username, passwordHash]
  )
  return result.rows[0]
}

export async function update(pool, id, changes) {
  const current = await getById(pool, id)
  if (!current) return null
  const merged = { ...current, ...changes }

  const result = await pool.query(
    `UPDATE profile SET username = $1, bio = $2 WHERE id = $3 RETURNING ${COLUMNS}`,
    [merged.username, merged.bio, id]
  )
  return result.rows[0]
}
