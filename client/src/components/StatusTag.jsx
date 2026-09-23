import Icon from './Icon.jsx'
import { getStatus } from '../utils/statuses.js'

// Atom. Icon + word, so status never depends on colour alone.
// Props: status (a status id), selected, onSelect.
// With onSelect it renders as a toggle button (used by StatusPicker);
// without it, it's a read-only label (used on BookSpine tooltips, etc).
export default function StatusTag({ status, selected = false, onSelect }) {
  const info = getStatus(status)
  if (!info) return null

  if (!onSelect) {
    return (
      <span className="tag">
        <Icon name={info.icon} />
        {info.label}
      </span>
    )
  }

  return (
    <button
      type="button"
      className="tag"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(status)}
    >
      <Icon name={info.icon} />
      {info.label}
    </button>
  )
}
