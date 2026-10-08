import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BookSpine from '../components/BookSpine.jsx'
import AddButton from '../components/AddButton.jsx'
import Icon from '../components/Icon.jsx'
import { getStatus } from '../utils/statuses.js'

// 6 books fit on a 360px phone without horizontal scrolling; 8 don't.
const SHELF_CAPACITY = 6

function chunk(items, size) {
  const rows = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

function ShelfRow({ books, onOpen }) {
  const ref = useRef(null)
  const [scrollable, setScrollable] = useState(false)

  // Only style the scrollbar when the row really overflows. Always styling it
  // makes Chromium draw a full-width bar even with nothing to scroll.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    function check() {
      setScrollable(el.scrollWidth > el.clientWidth + 1)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [books])

  return (
    <div className="shelf-row">
      <ul className={`shelf${scrollable ? ' shelf--scrollable' : ''}`} ref={ref}>
        {books.map((book) => (
          <li key={book.id}>
            <BookSpine title={book.title} onClick={() => onOpen(book.id)} />
          </li>
        ))}
      </ul>
      <div className="shelf__plank" />
    </div>
  )
}

export default function Shelf({ books }) {
  const { status } = useParams()
  const navigate = useNavigate()
  const info = getStatus(status)
  const shelfBooks = books.filter((book) => book.status === status)
  const rows = chunk(shelfBooks, SHELF_CAPACITY)

  return (
    <section className="section">
      <h2 className="shelf-heading">{info ? info.label : 'Shelf'}</h2>
      {rows.length > 0 ? (
        rows.map((row, i) => (
          <ShelfRow key={i} books={row} onOpen={(id) => navigate(`/books/${id}`)} />
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
