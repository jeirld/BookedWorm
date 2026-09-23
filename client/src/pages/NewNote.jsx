import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'

export default function NewNote({ books, addNote }) {
  const navigate = useNavigate()
  const [bookId, setBookId] = useState(books[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
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
    <form className="section form-grid" onSubmit={handleSubmit}>
      <div>
        <h2>New note</h2>
        <FormField
          label="Book"
          id="bookId"
          value={bookId}
          onChange={setBookId}
          error={errors.bookId}
          options={books.map((b) => ({ value: b.id, label: b.title }))}
        />
        <FormField label="Title" id="title" value={title} onChange={setTitle} error={errors.title} />
      </div>
      <div>
        <FormField label="Note" id="body" type="textarea" value={body} onChange={setBody} />
        <div className="actions">
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}
