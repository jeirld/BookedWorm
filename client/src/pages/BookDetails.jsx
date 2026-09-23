import { useParams } from 'react-router-dom'
import BookDetailsForm from './BookDetailsForm.jsx'

// This wrapper reads the :id param and hands the matching book to
// BookDetailsForm, keyed by book.id. The key is what makes React throw
// away and remount the form (fresh local state) when a different book is
// opened, instead of reusing stale state from the last book.
export default function BookDetails({ books, updateBook }) {
  const { id } = useParams()
  const book = books.find((b) => b.id === Number(id))

  if (!book) {
    return <p>Book not found.</p>
  }

  return <BookDetailsForm key={book.id} book={book} updateBook={updateBook} />
}
