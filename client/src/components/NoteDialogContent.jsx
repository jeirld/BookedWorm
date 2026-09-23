import { useState } from 'react'
import Button from './Button.jsx'
import FormField from './FormField.jsx'

// The dialog's body. Keyed by note.id in NoteDialog.jsx, so this remounts
// (fresh local state) whenever a different note is opened, the same
// key-remount pattern used in pages/BookDetails.jsx.
//
// Matches the wireframe's pop-up: tapping a note first asks "Do you want
// to edit this note?" (Read / Edit), which then opens a read-only view or
// an editable form. Read and Edit have no separate sketches of their own
// (see CLAUDE.md), so their exact layout is this component's call.
export default function NoteDialogContent({ note, onSave, onClose }) {
  const [step, setStep] = useState('choice') // 'choice' | 'read' | 'edit'
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  function handleSave() {
    onSave(note.id, { title, body })
    setStep('read')
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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </>
    )
  }

  // step === 'read'
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
