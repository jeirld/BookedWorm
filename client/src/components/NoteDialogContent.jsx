import { useState } from 'react'
import Button from './Button.jsx'
import FormField from './FormField.jsx'

export default function NoteDialogContent({ note, onSave, onDelete, onClose }) {
  const [step, setStep] = useState('choice')
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(note.id, { title, body })
    setSaving(false)
    setStep('read')
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this note?')) return
    await onDelete(note.id)
    onClose()
  }

  if (step === 'choice') {
    return (
      <>
        <h2>{note.title}</h2>
        <p>Do you want to edit this note?</p>
        <div className="dialog__actions">
          <Button variant="secondary" onClick={() => setStep('read')}>
            Read
          </Button>
          <Button variant="primary" onClick={() => setStep('edit')}>
            Edit
          </Button>
        </div>
      </>
    )
  }

  if (step === 'edit') {
    return (
      <>
        <h2>Edit note</h2>
        <FormField label="Title" id="note-title" value={title} onChange={setTitle} />
        <FormField label="Note" id="note-body" type="textarea" value={body} onChange={setBody} />
        <div className="dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={handleDelete} disabled={saving}>
            Delete
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2>{title}</h2>
      <p className="muted small">{note.bookTitle}</p>
      <p>{body}</p>
      <div className="dialog__actions">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  )
}
