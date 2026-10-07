import { useEffect, useRef } from 'react'
import NoteDialogContent from './NoteDialogContent.jsx'

export default function NoteDialog({ note, onSave, onDelete, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (note && !dialog.open) dialog.showModal()
    if (!note && dialog.open) dialog.close()
  }, [note])

  return (
    <dialog ref={ref} className="dialog" onClose={onClose}>
      {note && <NoteDialogContent key={note.id} note={note} onSave={onSave} onDelete={onDelete} onClose={onClose} />}
    </dialog>
  )
}
