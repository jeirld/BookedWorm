import { useParams, useNavigate } from 'react-router-dom'
import BookSpine from '../components/BookSpine.jsx'
import AddButton from '../components/AddButton.jsx'
import Icon from '../components/Icon.jsx'
import { getStatus } from '../utils/statuses.js'

export default function Shelf({ books }) {
  const { status } = useParams()
  const navigate = useNavigate()
  const info = getStatus(status)
  const shelfBooks = books.filter((book) => book.status === status)

  return (
    <section className="section">
      <h2>{info ? info.label : 'Shelf'}</h2>
      {shelfBooks.length > 0 ? (
        <>
          <ul className="shelf">
            {shelfBooks.map((book) => (
              <li key={book.id}>
                <BookSpine title={book.title} onClick={() => navigate(`/books/${book.id}`)} />
              </li>
            ))}
          </ul>
          <div className="shelf__plank" />
        </>
      ) : (
        <div className="panel">
          <Icon name={info?.icon ?? 'bookmark'} label="" className="icon" />
          <p className="muted">
            This shelf is empty. Add a book and set its status to {info?.label.toLowerCase() ?? 'this'} to
            see it here.
          </p>
        </div>
      )}
      <div className="actions">
        <AddButton label="Add book" onClick={() => navigate('/books/new')} />
      </div>
    </section>
  )
}
