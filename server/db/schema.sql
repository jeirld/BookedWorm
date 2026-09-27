CREATE TABLE IF NOT EXISTS profile (
  id         SERIAL PRIMARY KEY,
  username   TEXT NOT NULL,
  bio        TEXT NOT NULL DEFAULT '',
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS books (
  id         SERIAL PRIMARY KEY,
  title      TEXT        NOT NULL,
  author     TEXT        NOT NULL,
  blurb      TEXT        NOT NULL DEFAULT '',
  status     TEXT        NOT NULL DEFAULT 'want-to-read'
             CHECK (status IN ('want-to-read', 'reading', 'finished', 'dropped')),
  rating     INTEGER     NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  notes      TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id         SERIAL PRIMARY KEY,
  book_id    INTEGER     NOT NULL REFERENCES books (id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  body       TEXT        NOT NULL DEFAULT '',
  note_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS books_status_idx ON books (status);
CREATE INDEX IF NOT EXISTS notes_book_id_idx ON notes (book_id);
