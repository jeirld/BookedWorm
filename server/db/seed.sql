TRUNCATE TABLE notes, books, profile RESTART IDENTITY CASCADE;

INSERT INTO profile (username, bio, created_at) VALUES
  ('bookworm', 'Mostly dark academia and fantasy. Always slightly behind on my shelf.', '2026-01-12');

INSERT INTO books (title, author, blurb, status, rating, notes, created_at) VALUES
  ('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling',
   'An orphaned boy learns on his eleventh birthday that he is a wizard, and is swept off to a school where nothing is what it seems.',
   'finished', 5, 'Comfort reread.', '2026-01-12'),
  ('Percy Jackson and the Lightning Thief', 'Rick Riordan',
   'A troubled twelve-year-old discovers he is the son of a Greek god and is accused of stealing a weapon he never took.',
   'reading', 4, '', '2026-01-13'),
  ('When Cats Disappear from the World', 'Genki Kawamura',
   'A dying postman strikes a bargain with the devil, erasing one thing from the world for every extra day of life, and has to decide what he can live without.',
   'want-to-read', 0, '', '2026-01-14'),
  ('No Longer Human', 'Osamu Dazai',
   'A man who has never understood how to be human narrates his slow disintegration from childhood performance to total isolation.',
   'dropped', 2, 'Too bleak for right now.', '2026-01-15');
