// Temporary mock data for Increment 1 (frontend only). Increment 2 replaces
// this with fetch calls to the Express + PostgreSQL API (see CLAUDE.md).
//
// Shape matches the planned `books` table: id, title, author, blurb,
// status, rating, notes.
export const mockBooks = [
  {
    id: 1,
    title: 'The Secret History',
    author: 'Donna Tartt',
    blurb: 'A group of classics students at a New England college get away with murder, then slowly come apart.',
    status: 'finished',
    rating: 5,
    notes: 'Reread for the atmosphere alone.',
  },
  {
    id: 2,
    title: 'Piranesi',
    author: 'Susanna Clarke',
    blurb: 'A man lives alone in a vast, flooding House of endless halls and statues, and starts to question what he remembers.',
    status: 'reading',
    rating: 4,
    notes: '',
  },
  {
    id: 3,
    title: 'Jonathan Strange & Mr Norrell',
    author: 'Susanna Clarke',
    blurb: 'Two magicians bring magic back to England, and find they do not agree on what it should be used for.',
    status: 'want-to-read',
    rating: 0,
    notes: '',
  },
  {
    id: 4,
    title: 'Ninth House',
    author: 'Leigh Bardugo',
    blurb: 'A Yale freshman with a dark gift is recruited to police the secret societies that practice real magic.',
    status: 'dropped',
    rating: 2,
    notes: 'Might come back to it later.',
  },
  {
    id: 5,
    title: 'The Goldfinch',
    author: 'Donna Tartt',
    blurb: 'A boy survives an accident that kills his mother and steals a painting that shapes the rest of his life.',
    status: 'want-to-read',
    rating: 0,
    notes: '',
  },
  {
    id: 6,
    title: 'Circe',
    author: 'Madeline Miller',
    blurb: 'A minor goddess is exiled to a deserted island and slowly becomes someone the gods have to reckon with.',
    status: 'finished',
    rating: 5,
    notes: '',
  },
]

// A single-user profile row (see CLAUDE.md: no login yet, one profile).
export const mockProfile = {
  username: 'bookworm',
  createdAt: '2026-01-12',
  bio: 'Mostly dark academia and fantasy. Always slightly behind on my shelf.',
}
