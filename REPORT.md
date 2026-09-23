# Weekly Increment Report

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
