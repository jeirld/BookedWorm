import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BookSpine from '../components/BookSpine.jsx'
import AddButton from '../components/AddButton.jsx'
import Icon from '../components/Icon.jsx'
import { getStatus } from '../utils/statuses.js'

// A real shelf only fits so many books side by side. Once a status has
// more than this many, the rest spill onto a new shelf row (its own
// <ul className="shelf"> + plank) underneath, instead of squeezing
// everything onto one row.
//
// 6, not 8: 6 original-size books (--tap-min wide + the 6px gap
// components.css sets on .shelf) is 294px, which fits even on a
// narrow 360px phone (~328px available after gutters). 8 would be
// 394px -- too wide for that phone, needing a horizontal scroll every
// time regardless of screen size.
const SHELF_CAPACITY = 6

function chunk(items, size) {
  const rows = []
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size))
  }
  return rows
}

// One shelf row. Measures itself after render (and on resize) to know
// whether its books actually overflow the fixed-width plank -- the
// visible, tinted scrollbar (layout.css) only applies when they do, via
// the `scrollable` class below. Without this check, a shelf with just
// 1-2 books showed a full-width scrollbar with nothing to scroll: once
// a browser's ::-webkit-scrollbar is custom-styled, it switches to
// "classic" scrollbars that paint a full-track thumb even with zero
// overflow, instead of just hiding like the native default does.
function ShelfRow({ books, onOpen }) {
  const ref = useRef(null)
  const [scrollable, setScrollable] = useState(false)

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
