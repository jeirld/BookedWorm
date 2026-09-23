import { useParams, useNavigate } from 'react-router-dom'
import BookSpine from '../components/BookSpine.jsx'
import AddButton from '../components/AddButton.jsx'
import { getStatus } from '../utils/statuses.js'

export default function Shelf({ books }) {
  const { status } = useParams()
  const navigate = useNavigate()
  const info = getStatus(status)
  const shelfBooks = books.filter((book) => book.status === status)

  return (
    <section className="section">
      <h2>{info ? info.label : 'Shelf'}</h2>
      <ul className="shelf">
        {shelfBooks.map((book) => (
          <li key={book.id}>
            <BookSpine title={book.title} onClick={() => navigate(`/books/${book.id}`)} />
          </li>
        ))}
      </ul>
      <div className="shelf__plank" />
      {shelfBooks.length === 0 && <p className="muted">No books here yet.</p>}
      <div className="actions">
        <AddButton label="Add book" onClick={() => navigate('/books/new')} />
      </div>
    </section>
  )
}
