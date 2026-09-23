import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

// Organism. Props: title, onBack. When onBack is omitted, the back
// button is left out (Home has no back button, for example).
export default function Header({ title, onBack }) {
  const navigate = useNavigate()

  const handleBack = onBack ?? (() => navigate(-1))

  return (
    <header className="header">
      {onBack !== null && (
        <button type="button" className="icon-btn" onClick={handleBack} aria-label="Back">
          <Icon name="chevron-left" />
        </button>
      )}
      <h1 className="header__title">{title}</h1>
    </header>
  )
}
