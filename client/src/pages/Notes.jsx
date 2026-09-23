import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteCard from '../components/NoteCard.jsx'
import NoteDialog from '../components/NoteDialog.jsx'
import AddButton from '../components/AddButton.jsx'

export default function Notes({ notes, books, updateNote }) {
  const navigate = useNavigate()
  const [openId, setOpenId] = useState(null)
  const openNote = notes.find((n) => n.id === openId) ?? null

  function bookTitle(bookId) {
    return books.find((b) => b.id === bookId)?.title ?? 'Unknown book'
  }

  return (
    <section className="section">
      <h2>Notes</h2>
      <div className="note-list">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            excerpt={note.body}
            bookTitle={bookTitle(note.bookId)}
            date={note.date}
            onClick={() => setOpenId(note.id)}
          />
        ))}
      </div>
      {notes.length === 0 && <p className="muted">No notes yet.</p>}
      <div className="actions">
        <AddButton label="Add note" onClick={() => navigate('/notes/new')} />
      </div>
      <NoteDialog
        note={openNote ? { ...openNote, bookTitle: bookTitle(openNote.bookId) } : null}
        onSave={updateNote}
        onClose={() => setOpenId(null)}
      />
    </section>
  )
}
