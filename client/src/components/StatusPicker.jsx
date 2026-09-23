import StatusTag from './StatusTag.jsx'
import { STATUSES } from '../utils/statuses.js'

// Molecule. A radio group of the four StatusTags. Props: value, onChange.
export default function StatusPicker({ value, onChange }) {
  return (
    <div className="field">
      <span className="field__label" id="status-picker-label">
        Status
      </span>
      <div className="tag-group" role="radiogroup" aria-labelledby="status-picker-label">
        {STATUSES.map((status) => (
          <StatusTag
            key={status.id}
            status={status.id}
            selected={value === status.id}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  )
}
