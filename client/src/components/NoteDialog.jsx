import { useEffect, useRef } from 'react'
import NoteDialogContent from './NoteDialogContent.jsx'

// Organism. The Notes pop-up, built on the native <dialog> element.
// Props: note, onSave, onClose.
// `note` is null when nothing is open; this effect's only job is to
// synchronize the native <dialog> (an external system) with that prop by
// calling its imperative showModal()/close().
export default function NoteDialog({ note, onSave, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (note && !dialog.open) dialog.showModal()
    if (!note && dialog.open) dialog.close()
  }, [note])

  return (
    <dialog ref={ref} className="dialog" onClose={onClose}>
      {note && <NoteDialogContent key={note.id} note={note} onSave={onSave} onClose={onClose} />}
    </dialog>
  )
}
