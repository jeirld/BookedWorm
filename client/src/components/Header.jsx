import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import logo from '../assets/logo.svg'

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
      <h1 className="header__title">
        <img src={logo} alt="" width="100" height="100" className="header__logo" />
        {title}
      </h1>
    </header>
  )
}
