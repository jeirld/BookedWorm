TRUNCATE TABLE notes, books, profile RESTART IDENTITY CASCADE;

INSERT INTO profile (username, bio, created_at) VALUES
  ('bookworm', 'Mostly dark academia and fantasy. Always slightly behind on my shelf.', '2026-01-12');

INSERT INTO books (title, author, blurb, status, rating, notes, created_at) VALUES
  ('The Secret History', 'Donna Tartt',
   'A group of classics students at a New England college get away with murder, then slowly come apart.',
   'finished', 5, 'Reread for the atmosphere alone.', '2026-01-12'),
  ('Piranesi', 'Susanna Clarke',
   'A man lives alone in a vast, flooding House of endless halls and statues, and starts to question what he remembers.',
   'reading', 4, '', '2026-01-13'),
  ('Jonathan Strange & Mr Norrell', 'Susanna Clarke',
   'Two magicians bring magic back to England, and find they do not agree on what it should be used for.',
   'want-to-read', 0, '', '2026-01-14'),
  ('Ninth House', 'Leigh Bardugo',
   'A Yale freshman with a dark gift is recruited to police the secret societies that practice real magic.',
   'dropped', 2, 'Might come back to it later.', '2026-01-15'),
  ('The Goldfinch', 'Donna Tartt',
   'A boy survives an accident that kills his mother and steals a painting that shapes the rest of his life.',
   'want-to-read', 0, '', '2026-01-16'),
  ('Circe', 'Madeline Miller',
   'A minor goddess is exiled to a deserted island and slowly becomes someone the gods have to reckon with.',
   'finished', 5, '', '2026-01-17');
