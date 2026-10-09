# Security checklist

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` line 2 is `.env` (line 3 `.env.*`), `git check-ignore -v server/.env` matches it, and `git ls-files` shows no `.env` file |
| 2 | A `.env.example` with placeholder values only is committed | Yes | `server/.env.example` and `client/.env.example` are tracked and only hold placeholders like `postgresql://postgres:devpassword@localhost:5432/bookedworm` |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | Searched the source: the real Neon connection string is only in `server/.env` (ignored) and Render's settings. The demo account password `readmore123` is in the README and seed script on purpose, since it is a public demo login |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | Yes | Searched every commit for all four. Hits were only form field names (`type="password"`), book blurbs containing the word "secret", and placeholder URLs (`devpassword`, `user:pass@host`) |
| 5 | Any credential that was ever committed has been rotated | N/A | No real credential was ever committed (see row 4), so there was nothing to rotate |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | `DATABASE_URL`, `CORS_ORIGINS` and `NODE_ENV` are set in Render's dashboard. GitHub only holds two non-secret Actions variables (`VITE_USE_MOCK_API`, `VITE_API_BASE_URL`) |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | There is one workflow, `.github/workflows/deploy-pages.yml`. I read it, and the only values in it are `${{ vars.* }}` references, no literal secret |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | N/A | The workflow uses no secrets at all. It reads two public variables, because `VITE_` values are compiled into the public JavaScript anyway |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | Yes | Opened the log of the build job for a recent run (it succeeded in 11s). It only shows checkout, Node setup, `npm ci`, `vite build` and the artifact upload, with no secret, connection string or password anywhere. The only `echo` lines in the workflow write a `ready=true/false` flag and a notice |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | The only artifact is `client/dist`. I searched it for `.env*` and `.pem` files and for `postgres://` or `neon.tech`, and found none |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No | All four actions (`checkout`, `setup-node`, `upload-pages-artifact`, `deploy-pages`) are official `actions/` ones pinned to version tags (`@v4`, `@v3`). I accepted that for official GitHub actions |
| 12 | Secret scanning and push protection are enabled on the repository | Yes | Repo Settings > Advanced Security: Secret Protection (secret scanning) and Push protection both show a "Disable" button, so both are on. Push protection is also on for my whole account |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | All queries in `booksRepo.js`, `notesRepo.js`, `profileRepo.js` and `sessionsRepo.js` use `$1`, `$2` placeholders. The only interpolated text is fixed column lists written in the code. A username with `'; DROP TABLE x;--` in it was rejected with a 400 |
| 14 | The database is not open to the whole internet, or is reachable only by the app | No | Neon is reachable over the internet, but only with the connection password, and only over TLS. I did not restrict it by IP |
| 15 | The database user the app connects as has only the permissions it needs | No | The app connects as Neon's default owner role `neondb_owner`, which can do everything. A limited role would be better. I did not change it on the live database |
| 16 | Seed and sample data is invented, not real people's data | Yes | `server/db/seed.js` creates a demo account `bookworm` and four public books. No real person's data is in it |
| 17 | Debug, seed and reset routes are removed before going public | Yes | The only non-data routes are `/healthz` and `/readyz`. Seeding is an `npm run` script, not an HTTP route |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | A real login: sign up, log in, log out. Passwords are salted `scrypt` hashes and login tokens are stored only as hashes |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | N/A | I use Express and PostgreSQL on Neon, not Supabase or Firebase. I did test signed out: every data route returns 401 with no token |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | N/A | I use a real login, not Zero Trust or a shared app password. The public demo login is in the README |
| 21 | The gate covers every route, including the ones that only change data | Yes | `requireAuth` covers `/api/books`, `/api/notes`, `/api/profile` and logout. Only register, login and the two health checks are open. Tested with two accounts: the second got 404 reading, editing or deleting the first one's books and notes |
| 22 | The credentials for the gate are environment variables, not in source | N/A | There is no shared gate password. Each person's own password is stored only as a hash in the database |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | `validateBook`, `validateNote`, `validateProfile` and `validateCredentials` in `server.js` check types and length limits. Tested: a bad status, rating 9, a 300 character title and a 200kb body are all rejected |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | React escapes everything it renders, and `grep` finds no `dangerouslySetInnerHTML` or `innerHTML` in `client/src`. A book titled `<script>alert(1)</script>` is stored as plain text |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | Every error comes back as a short JSON message, and `NODE_ENV=production` is set on Render. I sent broken JSON and the reply was a plain 400 with no paths |
| 26 | CORS is not a wildcard on routes that change data | Yes | `cors({ origin: allowedOrigins })` reads `CORS_ORIGINS`, which is `https://jeirld.github.io` on Render. A request from `https://evil.example` gets no CORS header |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | No | Files and commit messages are clean, but my personal Gmail is the git commit author on every commit, and my name is in `LICENSE`. My professor said this is fine |
| 28 | No classmate's personal data in the repository | Yes | Searched the files and seed data: only my demo account and four public books |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | All packages come from npm. `git ls-files` shows 0 `node_modules` files and `.gitignore` lists `node_modules/`. `npm audit` reports 0 vulnerabilities in both `server/` and `client/` |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | The logo is my own project logo. Fonts (Literata and Figtree) are open-licensed Google Fonts. The icons are hand-built, and book covers are generated in CSS |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | The repository is public on purpose so GitHub Pages can serve it, and GitHub's API reports `"visibility": "public"` |

## Anything I found and fixed

Going through this checklist caught real gaps in the backend that I had not noticed. There was no `helmet`, one critical dependency advisory (`proxy-addr`, which affects the IP address the rate limiter uses), and broken JSON or huge ids returned a 500 error instead of a clean 400 or 404. I fixed those, plus unbounded login password length and expired sessions never being deleted, and `npm audit` now reports 0 vulnerabilities. Reading the Actions log for row 9 also showed that `npm ci` was reporting one high severity issue in the client (`source-map-js`, a build tool that is not in the shipped site) which I had not checked, because I had only audited the server. I fixed it with `npm audit fix` and the build still works. Building delete account also showed that anyone who logs into the public demo account could rename or delete it and break the demo login for everyone, so the server now refuses both for that account, and deleting any account asks for the password again. What I knowingly left: the database user has full permissions (row 15), and the login token is kept in `localStorage`, which an XSS bug could read.
