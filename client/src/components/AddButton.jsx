import Icon from './Icon.jsx'

export default function AddButton({ label, onClick }) {
  return (
    <button type="button" className="add-btn" onClick={onClick}>
      <Icon name="plus" />
      {label}
    </button>
  )
}
