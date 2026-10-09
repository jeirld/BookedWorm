# AI usage

This project was built with AI assistance. This file is the record of it. It is
graded as the finals badge, and it is worth 100 points.

Start it in week 1 and keep it up as you go. The commit history of this file is
part of the evidence: a file written all at once the night before the deadline
looks exactly like what it is.

## 1. How I used AI

At least six entries. One per real use. Every entry needs a commit link.

### 2026-09-23 - Building the React frontend from my wireframes

- **Tool:** Claude Code
- **What I asked for:** The seven screens and twelve design-system components
  from my proposal, wireframe sketches and design system, in React.
- **What it gave back:** The whole Increment 1 client: routing, all the pages, the
  components, and the CSS. I then went through about 15 rounds of "make it match
  the sketch", for example the Home page as a vertical list, the shelf holding
  exactly six books, and the header and logo sizes.
- **What I kept, what I changed, and why:** I kept the structure but changed the
  layout many times against my own sketches, because the first version did not
  match them. I checked each change by looking at it running, not just reading
  the code.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/727aea3 (first version),
  https://github.com/jeirld/BookedWorm/commit/b9dd481 (matching the wireframes)

### 2026-09-23 - Switching to the template's mock/real API pattern

- **Tool:** Claude Code
- **What I asked for:** Move the books, notes and profile data out of plain React
  state and into the `src/api/` pattern the course template requires.
- **What it gave back:** `mockApi.js` (saves to localStorage), `httpApi.js` (for
  the real backend) and an `index.js` that picks one. Every page that saves
  something became async.
- **What I kept, what I changed, and why:** I kept all of it. The side effect I
  liked is that data now survives a page reload, which plain state never did.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/f4e7693

### 2026-09-27 - Database schema and seed data

- **Tool:** Claude Code
- **What I asked for:** A PostgreSQL schema for profile, books and notes, with a
  foreign key from notes to books and a check on the status column.
- **What it gave back:** `schema.sql` and a seed file. Before I trusted it, it ran
  the schema through `pg-mem` (a fake in-memory Postgres) to check it worked.
- **What I kept, what I changed, and why:** I kept the schema. I replaced the
  placeholder seed books with books I have actually read, as a separate commit.
- **Design decisions that were mine:** Claude wrote the SQL, but these choices came
  from my proposal and wireframes. A note belongs to exactly one book, because
  every note in my wireframes is written about a specific book, so `book_id`
  is required. Deleting a book deletes its notes with it (`ON DELETE CASCADE`),
  because a note with no book would only show up as "Unknown book". There are
  only four statuses, and the database enforces that with a `CHECK`, not just
  the screen.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/5ac7142 (schema),
  https://github.com/jeirld/BookedWorm/commit/5f03970 (my books in the seed)

### 2026-10-02 and 2026-10-06 - Repo layer and Express routes

- **Tool:** Claude Code
- **What I asked for:** Parameterised SQL functions for books, notes and profile,
  then the Express routes and validation that match what my `httpApi.js` already
  calls.
- **What it gave back:** Three repo files and a rewritten `server.js`. Updates
  fetch the row first and merge the changes over it, the same way the mock API
  does partial updates. It also turned a Postgres foreign-key error into a clean
  400 instead of a 500.
- **What I kept, what I changed, and why:** I kept both. I made the two parts
  separate commits on separate days on purpose, so the history shows the real
  order I did them in.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/03ba160 (repo layer),
  https://github.com/jeirld/BookedWorm/commit/d557bd1 (routes)

### 2026-10-07 - A date bug found by testing against a fake database

- **Tool:** Claude Code
- **What I asked for:** Check the schema works with what the React pages expect.
- **What it gave back:** It found that `pg` returns dates as JavaScript `Date`
  objects, and `Account.jsx` and `NoteCard.jsx` print the date directly, which
  React cannot render and would crash on. The fix was a few lines in `pool.js`
  to return dates as plain strings. I then confirmed it against the real Neon
  database, not just the fake one.
- **What I kept, what I changed, and why:** I kept it. This is a bug I would have
  hit only after deploying.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/4dcea47

### 2026-10-07 - Delete for books and notes (I wrote this one)

- **Tool:** Claude Code, only to review and explain
- **What I asked for:** I wrote the code myself and asked Claude to read it, explain
  how the functions connect, and catch problems.
- **What it gave back:** Review comments. It caught that my first draft
  navigated to `/shelf/all`, which is not a real shelf, and used
  `variant="danger"`, which has no CSS in this project. It also wrote one line
  itself, the cascade in `mockApi.js`'s `deleteBook` (see case 3 below).
- **What I kept, what I changed, and why:** I fixed both problems myself. Details
  are in section 3.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/ccb4798 (books),
  https://github.com/jeirld/BookedWorm/commit/76ccdcc (notes)

### 2026-10-08 - Deploying all three pieces

- **Tool:** Claude Code
- **What I asked for:** Get the client on GitHub Pages, the API on a host, and the
  database on a host, and check the live site really talks to the real API.
- **What it gave back:** Neon for the database, Render for the API, the repo
  variables for the client build, and live tests with a browser script. The first
  live load was a blank page, and the fix is case 1 below.
- **What I kept, what I changed, and why:** I kept all of it. I switched on the
  GitHub Pages setting myself, since that is an account action.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/5143d74

### 2026-10-08 - Accounts: signup, login, logout, private libraries

- **Tool:** Claude Code
- **What I asked for:** Real accounts, so each person has their own library.
- **What it gave back:** The whole feature: password hashing with `scrypt`, session
  tokens stored only as hashes, rate limiting on login, every query scoped to
  the logged-in user, plus the login and signup screens and a logout button in
  the client. It tested cross-user access with two accounts, first against a
  real database and then on the live site.
- **What I kept, what I changed, and why:** I kept all of it. I did not write any of
  this feature, so it counts on the AI side in section 3.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/e3f4109 (server),
  https://github.com/jeirld/BookedWorm/commit/6609aec (client)

### 2026-10-09 - Security review of the finished backend

- **Tool:** Claude Code
- **What I asked for:** Go through the security checklist against the finished
  backend, fix anything real, and test it before committing.
- **What it gave back:** Seven fixes: missing `helmet`, a critical `proxy-addr`
  advisory, bad JSON returning a 500, huge ids returning a 500, unbounded login
  password length, expired sessions never deleted, and the rate limiter's
  memory never shrinking. I checked them with 39 API checks and a real browser
  call from another origin. The findings are written up in
  my security checklist.
- **What I kept, what I changed, and why:** I kept all of it, and the checklist keeps
  the things I chose not to fix as known gaps.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/27968bb (fixes),
  https://github.com/jeirld/BookedWorm/commit/7dfb442 (checklist)

### 2026-10-09 - Search, status counts and delete account (I wrote the database part)

- **Tool:** Claude Code, to test and to connect my code to the app
- **What I asked for:** I wrote three database functions myself: `search` and
  `countByStatus` in `booksRepo.js`, and `remove` in `profileRepo.js`. I asked
  Claude to test them and then connect them to the app.
- **What it gave back:** 19 checks against a throwaway database, which all
  passed without me changing anything. Then the routes (`GET /api/books?search=`,
  `GET /api/stats`, `DELETE /api/profile`), the search box on Home, the status
  counts on the Account page, and the Delete account button. Delete account asks
  for the password again. While doing this it found that anyone logged into the
  public demo account could rename or delete it and break the demo login for
  everyone, so the server now refuses both.
- **What I kept, what I changed, and why:** I kept all of it. The SQL is mine,
  and the routes, the client screens and the demo account protection are Claude's.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/28eb471 (my database
  functions), https://github.com/jeirld/BookedWorm/commit/449dcb3 (routes),
  https://github.com/jeirld/BookedWorm/commit/8e4a458 (client)

## 2. Where the AI got it wrong

Three cases. Be specific. If you write that the AI was never wrong, this section
scores zero.

### Case 1 - It called the site deploy-ready, and the first live load was a blank page

- **What it gave me:** A client that it described as ready to deploy to GitHub
  Pages.
- **What was wrong with it:** The template requires a base path for GitHub Pages
  (`/BookedWorm/`). `vite.config.js` never read `VITE_BASE_PATH`, `BrowserRouter`
  had no `basename`, and the build did not make a `404.html`. It never loaded the
  site from a `/BookedWorm/` path before saying so. On the live site the page
  was blank, because the files were requested from `jeirld.github.io/assets/...`
  and got a 404.
- **What I did instead:** Had it fix the config, the router, and the build. It
  worked on the next deploy.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/5143d74

### Case 2 - The header title was cut off on every phone, since Increment 1

- **What it gave me:** A header with the title at a fixed `3rem` next to a fixed
  100px logo, and it told me the header was finished.
- **What was wrong with it:** On a phone the two did not fit and the title was
  clipped to "Booked Wo". It had been like that
  on the live site since Increment 1 and was only caught when the new login
  screen was being checked on a 390px screenshot.
- **What I did instead:** The title and logo now scale with the viewport.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/37b6469

### Case 3 - The mock API did not match the real server when deleting a book

- **What it gave me:** `mockApi.js`, written earlier in the project, where
  `deleteBook` only removed the book.
- **What was wrong with it:** The real database deletes a book's notes with it
  (`ON DELETE CASCADE`), but the mock did not. In demo mode, a deleted book left
  its notes behind, and after a reload they showed up under "Unknown book". It
  was only found when a browser test was run on the finished delete feature,
  not when the mock was written.
- **What I did instead:** One line in the mock's `deleteBook` that also removes
  that book's notes. My own `deleteBook` in `App.jsx` does the same to its state,
  so the screen matches the server.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/ccb4798

### Case 4 - It built the whole backend before checking its security (bonus)

- **What it gave me:** A finished API, announced as done, with accounts.
- **What was wrong with it:** When I actually went through the security checklist
  there was no `helmet`, one critical dependency advisory, and two kinds of
  ordinary client mistakes (broken JSON, a huge id) that came back as 500 server
  errors with a stack trace in the logs. None of it was needed for the app to
  work, which is why it was never noticed.
- **What I did instead:** Fixed them in one commit after running tests against a
  real database, and listed what I chose not to fix in my security checklist.
- **Commit:** https://github.com/jeirld/BookedWorm/commit/27968bb

## 3. Who wrote what

At least a fifth of this project is code you wrote yourself. Name it, and explain
it in your own words.

> Group projects: give each member their own heading below, and use your GitHub
> handle as the heading. You are graded on your own section.

### Written by me

<!-- Add one block per feature I write myself, same format as the first one. -->

- **File:** `client/src/App.jsx` (`deleteBook`, `deleteNote`),
  `client/src/pages/BookDetails.jsx`, `client/src/pages/BookDetailsForm.jsx`
  (Delete button and `handleDelete`), `client/src/pages/Notes.jsx`,
  `client/src/components/NoteDialog.jsx`,
  `client/src/components/NoteDialogContent.jsx`
- **Commit:** https://github.com/jeirld/BookedWorm/commit/ccb4798 (books),
  https://github.com/jeirld/BookedWorm/commit/76ccdcc (notes)
- **What it does and why it is built this way:**

  I used AI to help me understand and review the delete functionality for books and notes. I wrote the code myself and used AI to check the code, explain how the functions connect, and catch small issues.

  **Book Delete**

  The Delete button in `BookDetailsForm.jsx` asks for confirmation before deleting. After confirmation, it navigates back to the book's original shelf and calls `deleteBook`.

  In `App.jsx`, `deleteBook` calls the API to delete the book, then uses `.filter()` to remove the book from the `books` state. It also removes the book's notes from the `notes` state to match the server's cascade delete.

  I navigate before deleting so the Book Details page does not briefly show "Book not found" after the book is removed from state.

  **Note Delete**

  The `deleteNote` function in `App.jsx` calls the API and removes the deleted note from the `notes` state using `.filter()`.

  I passed `deleteNote` from `App.jsx` through `Notes.jsx` and `NoteDialog.jsx` to `NoteDialogContent.jsx` using props. The Delete button in the edit view calls `handleDelete`, which asks for confirmation before deleting the note.

  After the note is deleted, `openNote` becomes `null` because the deleted note is no longer in the `notes` array. The dialog then closes. I also call `onClose()` after the deletion so the dialog is explicitly closed.

  I used the existing `secondary` button variant for Delete because `danger` is not part of the project's existing button styles.

### Written by me (database functions)

- **File:** `server/booksRepo.js` (`search`, `countByStatus`) and
  `server/profileRepo.js` (`remove`)
- **Commit:** https://github.com/jeirld/BookedWorm/commit/28eb471
- **What it does and why it is built this way:**

  `search` finds a person's books where the title or the author contains the text they typed, ignoring upper and lower case. It uses `ILIKE` with the text wrapped in `%` signs, and the text goes in as a query parameter, never inside the SQL string. The brackets around `title ILIKE $2 OR author ILIKE $2` matter, because without them the `OR` would also match other people's books and skip the `profile_id = $1` check.

  `countByStatus` uses `GROUP BY status` to give one row per status with how many of that person's books are in it. I cast the count with `::int` because Postgres sends `COUNT(*)` back as text.

  `remove` deletes the account row and returns `true` if something was deleted. I did not have to delete the books, notes and sessions myself, because the schema already deletes them with the account (`ON DELETE CASCADE`).

- **How much of the project is mine:** About 76 lines of roughly 2,900 (the delete buttons plus these three functions), which is around 3%. That is far less than the one-fifth the assignment asks for. Most of the project, including the frontend, the routes, accounts and the deployment, was written by Claude, and the entries in section 1 show which.

- **Also mine:** the choice of the four books in `server/db/seed.js` (the books I
  have actually read, which replaced the placeholders), commit https://github.com/jeirld/BookedWorm/commit/5f03970.

### The AI-written part I understand best

- **File:** `server/auth.js` and `server/sessionsRepo.js`
- **Commit:** https://github.com/jeirld/BookedWorm/commit/e3f4109
- **What it does and why we kept it:**

  When someone signs up, the password is never stored. It is mixed with a random
  salt and run through `scrypt`, which is deliberately slow, and only the result
  is saved. At login the same thing is done to what was typed and the two are
  compared. When login works, the server makes a long random token and gives it
  to the browser, and saves only a hash of it in the `sessions` table. So if
  someone got a copy of the database they would still not have anything that logs
  in. Every request after that sends the token, and the server looks up which
  account it belongs to and uses that account's id in every SQL query, which is
  what keeps one person's books away from everyone else. We kept it because it
  is a small amount of code that uses only what Node already has.
