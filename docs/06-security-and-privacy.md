# Security and privacy

What I checked before making this repository public, and what I knowingly accepted.
The full row-by-row checklist is [SECURITY-CHECKLIST.md](../SECURITY-CHECKLIST.md).

## In short

- **Secrets:** `.env` is git-ignored and was never committed. Only
  `.env.example` files with placeholders are tracked. The database connection
  string lives in Render's dashboard.
- **SQL:** every query is parameterised, and every query on books and notes
  includes the signed-in person's id.
- **Input:** validated on the server with a length limit on every text field.
- **Passwords:** salted `scrypt` hashes. Login tokens are stored only as hashes and
  expire after 14 days.
- **Network:** CORS names the one allowed site, `helmet` is on, the password routes
  are rate limited, and `npm audit` reports 0 vulnerabilities.
- **Privacy:** the app stores a username, a hashed password, a short bio, and the
  books and notes a person types in. No email, no location, no tracking.
  Seed data is a demo account and four public books.

## The riskiest thing, and the tradeoff

Storing other people's passwords. They are only kept as salted hashes, and the
amount of personal data is kept to a username and a bio. Knowingly accepted: the
login token is kept in the browser's `localStorage`, and there is no password
reset. Fixing those properly needs cookies or an email service, which was out of
scope. Deleting an account asks for the password again, and the public demo
account cannot be deleted or renamed.
