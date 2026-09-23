import { useState } from 'react'
import StarRating from '../components/StarRating.jsx'
import StatusPicker from '../components/StatusPicker.jsx'
import Button from '../components/Button.jsx'

// Save updates the book and STAYS on this screen (per CLAUDE.md), so the
// form fields are local state, seeded once from `book` when this component
// mounts. BookDetails.jsx remounts it (via `key`) whenever a different
// book is opened, so the fields always start from the right values.
//
// Field order matches the wireframe: title, star rating, blurb, status,
// then author last.
export default function BookDetailsForm({ book, updateBook }) {
  const [status, setStatus] = useState(book.status)
  const [rating, setRating] = useState(book.rating)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateBook(book.id, { status, rating })
    setSaved(true)
  }

  return (
    <section className="section">
      <h2>{book.title}</h2>
      <StarRating value={rating} onChange={setRating} />
      <p>{book.blurb}</p>
      <StatusPicker value={status} onChange={setStatus} />
      <p className="muted">{book.author}</p>
      <div className="actions">
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
      {saved && <p className="muted small">Saved.</p>}
    </section>
  )
}
