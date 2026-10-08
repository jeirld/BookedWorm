export async function create(pool, tokenHash, profileId, expiresAt) {
  await pool.query(
    'INSERT INTO sessions (token_hash, profile_id, expires_at) VALUES ($1, $2, $3)',
    [tokenHash, profileId, expiresAt]
  )
}

export async function findProfileId(pool, tokenHash) {
  const result = await pool.query(
    'SELECT profile_id FROM sessions WHERE token_hash = $1 AND expires_at > now()',
    [tokenHash]
  )
  return result.rows[0]?.profile_id ?? null
}

export async function remove(pool, tokenHash) {
  await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash])
}
