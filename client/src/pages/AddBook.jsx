import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import StatusPicker from '../components/StatusPicker.jsx'
import StarRating from '../components/StarRating.jsx'
import Button from '../components/Button.jsx'

export default function AddBook({ addBook }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [blurb, setBlurb] = useState('')
  const [status, setStatus] = useState('want-to-read')
  const [rating, setRating] = useState(0)
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!author.trim()) nextErrors.author = 'Author is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    addBook({ title, author, blurb, status, rating })
    // Goes to the shelf matching the chosen status, per CLAUDE.md.
    navigate(`/shelf/${status}`)
  }

  return (
    <form className="section form-grid" onSubmit={handleSubmit}>
      <div>
        <h2>Add book</h2>
        <FormField label="Title" id="title" value={title} onChange={setTitle} error={errors.title} />
        <FormField label="Author" id="author" value={author} onChange={setAuthor} error={errors.author} />
        <StatusPicker value={status} onChange={setStatus} />
        <div className="actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
      <div>
        <div className="field">
          <span className="field__label" id="rating-label">
            Rating (optional)
          </span>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <FormField
          label="Blurb (optional)"
          id="blurb"
          type="textarea"
          value={blurb}
          onChange={setBlurb}
        />
        <div className="actions">
          <Button variant="primary" type="submit">
            Add
          </Button>
        </div>
      </div>
    </form>
  )
}
