import { useState } from 'react'
import Button from './Button.jsx'
import FormField from './FormField.jsx'

// The dialog's body. Keyed by note.id in NoteDialog.jsx, so this remounts
// (fresh local state) whenever a different note is opened, the same
// key-remount pattern used in pages/BookDetails.jsx.
// Edit note has no separate sketch (see CLAUDE.md), so editing happens
// inline here instead of on its own page.
export default function NoteDialogContent({ note, onSave, onClose }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  function handleSave() {
    onSave(note.id, { title, body })
    setEditing(false)
  }

  if (editing) {
    return (
      <>
        <h2>Edit note</h2>
        <FormField label="Title" id="note-title" value={title} onChange={setTitle} />
        <FormField label="Note" id="note-body" type="textarea" value={body} onChange={setBody} />
        <div className="dialog__actions">
          <Button variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2>{note.title}</h2>
      <p className="muted small">{note.bookTitle}</p>
      <p>{note.body}</p>
      <div className="dialog__actions">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>
    </>
  )
}
