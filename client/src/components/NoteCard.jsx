import Icon from './Icon.jsx'

// Molecule. Props: title, excerpt, bookTitle, date, onClick.
export default function NoteCard({ title, excerpt, bookTitle, date, onClick }) {
  return (
    <button type="button" className="note-card" onClick={onClick}>
      <span className="note-card__title">{title}</span>
      <span className="note-card__excerpt">{excerpt}</span>
      <span className="note-card__meta">
        <Icon name="book-open" />
        {bookTitle} &middot; {date}
      </span>
    </button>
  )
}
