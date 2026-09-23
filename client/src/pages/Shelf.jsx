import { useParams, useNavigate } from 'react-router-dom'
import BookSpine from '../components/BookSpine.jsx'
import AddButton from '../components/AddButton.jsx'
import Icon from '../components/Icon.jsx'
import { getStatus } from '../utils/statuses.js'

// A real shelf only fits so many books side by side. Once a status has
// more than this many, the rest spill onto a new shelf row (its own
// <ul className="shelf"> + plank) underneath, instead of squeezing
// everything onto one row.
const SHELF_CAPACITY = 8

function chunk(items, size) {
  const rows = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

export default function Shelf({ books }) {
  const { status } = useParams()
  const navigate = useNavigate()
  const info = getStatus(status)
  const shelfBooks = books.filter((book) => book.status === status)
  const rows = chunk(shelfBooks, SHELF_CAPACITY)

  return (
    <section className="section">
      <h2>{info ? info.label : 'Shelf'}</h2>
      {rows.length > 0 ? (
        rows.map((row, i) => (
          <div key={i} className="shelf-row">
            <ul className="shelf">
              {row.map((book) => (
                <li key={book.id}>
                  <BookSpine title={book.title} onClick={() => navigate(`/books/${book.id}`)} />
                </li>
              ))}
            </ul>
            <div className="shelf__plank" />
          </div>
        ))
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
