import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating.jsx'
import StatusPicker from '../components/StatusPicker.jsx'
import Button from '../components/Button.jsx'

export default function BookDetailsForm({ book, updateBook, deleteBook }) {
  const [status, setStatus] = useState(book.status)
  const [rating, setRating] = useState(book.rating)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await updateBook(book.id, { status, rating })
    setSaving(false)
    setSaved(true)
  }

  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this book?')) {
      navigate(`/shelf/${book.status}`)
      await deleteBook(book.id)
    }
  }

  return (
    <section className="section">
      <div className="panel">
        <h2>{book.title}</h2>
        <StarRating value={rating} onChange={setRating} />
        <p>{book.blurb}</p>
        <StatusPicker value={status} onChange={setStatus} />
        <p className="muted">{book.author}</p>
        <div className="actions">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </div>
        {saved && <p className="muted small">Saved.</p>}
      </div>
    </section>
  )

}