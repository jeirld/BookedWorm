# Weekly Increment Report

## Week of: 2026-10-04

## What changed this week

- Pushed the repo layer (booksRepo, notesRepo, profileRepo) and the
  Express routes + validation as two separate commits on two separate
  days, continuing the plan from last week.
- Set up a real PostgreSQL database (Neon, free tier) instead of
  testing against pg-mem only. Ran the schema and seed against it, then
  exercised every route for real: creating and partially updating a
  book, creating a note with a bad bookId and confirming it returns a
  clean 400 instead of crashing, and deleting a book to confirm its
  notes actually cascade-delete.
- Confirmed the pool.js date-parsing bugfix is both necessary and
  correct against a real database, not just pg-mem's imitation of one.

## Why

pg-mem only imitates Postgres, and I didn't want to find out during
deployment that something that passed pg-mem doesn't actually work
against the real thing. Testing against a real hosted database now,
before picking an API host, means deployment day is just "point the
API at a database that's already proven to work" instead of debugging
the database and the host at the same time.

## What broke or what I got stuck on

- Nothing broke against the real database that hadn't already been
  caught by pg-mem. The one open item is that the pool.js bugfix is
  tested and working but still not committed -- it's sitting staged,
  waiting for its own day so the commit history doesn't bunch two
  unrelated days of work into one timestamp.

## What is left

- Commit and push the pool.js bugfix.
- Deploy all three pieces: client to GitHub Pages, API to a host,
  database to a host (database is already set up and tested).
- Delete for books and notes. The API layer already supports it, but no
  buttons yet.
- The rest of the doc files, the security checklist, and the demo video.
- Writing AI-USAGE.md.

---

## Week of: 2026-09-27

## What changed this week

- Started my second part of the development, the real backend. Designed the PostgreSQL schema
  for the three actual resources (profile, books, notes), replacing some of the templates.
- Added a foreign key from notes to books, so a note always belongs to
  one book and gets deleted along with it. Also added a check
  constraint on status so the database can't end up with a status the
  app doesn't recognize.
- Seeded the database with sample data, personalized with books I've
  actually read instead of placeholder titles.
- Pushed the schema and seed data to GitHub as their own commit,
  separate from the query and route code that's still in progress.

## Why

Backend work is too big to do in one sitting, so I'm building it in
layers instead so that I can visually see the progress without getting overloaded by all codes: schema first, then the queries, then the routes,
committing each layer once it works. That way the commit history
actually shows how it came together.

## What broke or what I got stuck on

- While testing the schema, found that PostgreSQL date columns come
  back as JavaScript Date objects instead of plain strings. Two screens
  (Account and the note list) print the date straight into the page, so
  this would have crashed the app the moment it hit a real database
  instead of the mock. Fixed it before it ever reaches an API response.

## What is left

- The query layer (parameterized SQL for books, notes, profile) and the
  Express routes themselves, written but not committed yet.
- Deploying all three pieces: client to GitHub Pages, API to a host,
  database to a host. Nothing is live yet.
- Delete for books and notes. The API layer already supports it, but no
  buttons yet.
- The rest of the doc files, and the demo video.
- Writing AI-USAGE.md

---

## Week of: 2026-09-23

## What changed this week

- Created the front end using React. This are the home, shelf, book details, add book, notes, new note, and account. Which are all based to my design system paper that has been submitted.

- Built all 12 components from the design system's component list
  (Button, AddButton, StatusTag, StarRating, FormField, StatusPicker,
  StatusCard, BookSpine, NoteCard, Header, BottomNav, NoteDialog).

- Built and followed all the sketches I have made which are hte wireframes in creating the frontend.

- Added the created logo by my partner to the website and fixes some adjustments regarding the ui and the overall design of the website


- Created the necessary documents needed for this week and setting up the public repo of the project

## Why

To get a working, clickable interface finished before starting the
the hard part which is the backend. Matching the  wireframes and design system mattered because those earlier steps were a;ready documented and must be followed because there are considered as references.

## What broke or what I got stuck on

- Tried to make the shelf's books stretch to fill the row when there
  were only 1-2 of them, but put the CSS on the wrong element (the
  book itself instead of the list item wrapping it), so it silently
  did nothing until I measured it and found the bug.
- There has been trick bugs regarding the ui on the shelf especially if it should be on one shelf or be seperated into multiple planks or just put it on one plank.
- Miscalculated how many books would fit on one shelf row, twice,
  because I forgot the shelf element has its own left/right padding
  eating into the available space, on top of the page's own margins.


## What is left

- The actual Express + PostgreSQL backend.
- Deploying all three pieces: client to GitHub Pages, API to a host,
  database to a host. Nothing is live yet.
- Delete for books and notes. The API layer already supports it, but no buttons yyet
- The rest of the doc files, and the demo video.
- Writing AI-USAGE.md 
