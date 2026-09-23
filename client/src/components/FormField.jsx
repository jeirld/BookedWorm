import Icon from './Icon.jsx'

// Molecule. Props: label, id, type, value, onChange, error, options
// (options makes it render a <select>; type="textarea" renders a <textarea>).
export default function FormField({ label, id, type = 'text', value, onChange, error, options }) {
  const describedBy = error ? `${id}-error` : undefined

  let control
  if (options) {
    control = (
      <select
        id={id}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    )
  } else if (type === 'textarea') {
    control = (
      <textarea
        id={id}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
    )
  } else {
    control = (
      <input
        id={id}
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
    )
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {control}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          <Icon name="x-circle" label="Error" />
          {error}
        </p>
      )}
    </div>
  )
}
