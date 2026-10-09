# Proposal

The submitted version is the Canvas answer for m8a1. This copy sits next to the
code and is updated to match what was actually built. Last updated 2026-10-09.

## What it is

Booked Worm is a reading tracker. People add the books they want to read and
move each one through a status as they go: **Want to read, Reading, Finished,
Dropped**. Each book has a title, author, blurb, rating (0 to 5 stars) and notes,
and notes can also be written as separate entries tied to one book.

**Who it is for:** anyone who reads several books at once and loses track of where
they left off.

## Core features

| Feature | State |
| --- | --- |
| Add a book with title, author, blurb, status and rating | Done |
| Four statuses, each with an icon and a word (never colour alone) | Done |
| Browse by status: Home lists the four statuses, Shelf shows the books as spines | Done |
| Book details: change rating and status, save, delete | Done |
| Notes tied to a book: add, read, edit, delete | Done |
| Account page with a biography | Done |
| Data saved in a real PostgreSQL database through an Express API | Done |
| Accounts: sign up, log in, log out, a private library per person | Done (added in October, see below) |

## Changes from the first proposal

- **Accounts were added.** The first version of the plan was one person and no
  login. The proposal never ruled login out, and a deployed public site with one
  shared library would have let strangers edit each other's books, so each person
  now has their own account. Passwords are hashed and every query is scoped to the
  signed-in person. See [06-security-and-privacy.md](06-security-and-privacy.md).
- **Delete** for books and notes was a late addition (2026-10-07).
- **Dropped from the original plan:** nothing was cut.

## Stretch goals (not built)

- Change or reset a password, and a delete-my-account button
- Search and sort on the shelves
- Reading progress (page or percent) on a book
- Importing a list of books

## Where each piece is hosted

| Piece | Where | The free tier's catch | Since |
| --- | --- | --- | --- |
| Client (React, Vite) | GitHub Pages, https://jeirld.github.io/BookedWorm/ | Public repo only. Rebuilds on pushes that touch `client/` | 2026-10-08 |
| API (Express) | Render free web service, https://bookedworm.onrender.com | Sleeps when idle, so the first request after a quiet spell can take about a minute | 2026-10-08 |
| Database (PostgreSQL) | Neon free tier, Singapore | Small storage limit, and the database also pauses when idle | 2026-10-06 |

## Demo mode

The client has a simulated backend (`mockApi.js`, browser storage) that the course
template calls demo mode. It is on by default when running locally. **On the
deployed site it has been off since 2026-10-08**: the repository variable
`VITE_USE_MOCK_API` is `false` and the site talks to the real API. A deployed
page with no demo-mode notice is the sign it is on the real API.

## Risks

- **The one risk named in the proposal: updating one book in an array without
  breaking React's change detection or touching other books.** Solved and tested.
  Updates build a new array with `.map()`, and deletes use `.filter()`.
- **Deployment surprises (host signup, CORS, cold starts).** Turned out manageable.
  The one real problem was the GitHub Pages base path, which gave a blank page on
  the first deploy and was fixed the same day.
- **Security grew once accounts existed.** It went from "no personal data" to
  "stores passwords". Handled and written up in the security checklist, with the
  known gaps listed there.
- **Backend experience.** The part I felt least prepared for. Building it in
  small separate steps (schema, repo layer, routes, then deploy) made it
  testable at each stage.
