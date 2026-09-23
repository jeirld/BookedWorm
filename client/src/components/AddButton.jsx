import Icon from './Icon.jsx'

// Atom. The one accent (Burnt Umber) call-to-action: Add book, Add note.
// Props: label, onClick.
export default function AddButton({ label, onClick }) {
  return (
    <button type="button" className="add-btn" onClick={onClick}>
      <Icon name="plus" />
      {label}
    </button>
  )
}
