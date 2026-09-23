import Icon from './Icon.jsx'

// Atom. Props: value (0-5), onChange. Read-only when onChange is omitted.
export default function StarRating({ value = 0, onChange }) {
  const stars = [1, 2, 3, 4, 5]
  const readOnly = !onChange

  return (
    <span
      className={`stars${readOnly ? '' : ' stars--input'}`}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `Rated ${value} out of 5 stars` : 'Rating'}
    >
      {stars.map((n) =>
        readOnly ? (
          <span key={n} className={`star${n <= value ? ' on' : ''}`}>
            <Icon name="star" />
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={`star${n <= value ? ' on' : ''}`}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onClick={() => onChange(n)}
          >
            <Icon name="star" />
          </button>
        ),
      )}
    </span>
  )
}
