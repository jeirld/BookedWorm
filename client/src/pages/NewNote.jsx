import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'

// Single column, and Title -> Note text -> Book, per the wireframe
// (both the mobile and desktop New note sketches use one column, not the
// two-column split Add book uses).
export default function NewNote({ books, addNote }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [bookId, setBookId] = useState(books[0]?.id ?? '')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!bookId) nextErrors.bookId = 'Choose a book.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    addNote({
      bookId: Number(bookId),
      title,
      body,
      date: new Date().toISOString().slice(0, 10),
    })
    navigate('/notes')
  }

  return (
    <section className="section">
      <h2>New note</h2>
      <form className="panel" onSubmit={handleSubmit}>
        <FormField label="Title" id="title" value={title} onChange={setTitle} error={errors.title} />
        <FormField label="Note" id="body" type="textarea" value={body} onChange={setBody} />
        <FormField
          label="Book"
          id="bookId"
          value={bookId}
          onChange={setBookId}
          error={errors.bookId}
          options={books.map((b) => ({ value: b.id, label: b.title }))}
        />
        <div className="actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </section>
  )
}
