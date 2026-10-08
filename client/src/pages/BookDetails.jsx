import { useParams } from 'react-router-dom'
import BookDetailsForm from './BookDetailsForm.jsx'

export default function BookDetails({ books, updateBook, deleteBook }) {
  const { id } = useParams()
  const book = books.find((b) => b.id === Number(id))

  if (!book) {
    return <p>Book not found.</p>
  }

  return <BookDetailsForm key={book.id} book={book} updateBook={updateBook} deleteBook={deleteBook} />
}
