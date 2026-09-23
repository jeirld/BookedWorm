import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'

// Organism. Props: active (kept for the design system's prop table;
// NavLink already derives the active state from the current route).
const ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/notes', label: 'Notes', icon: 'note' },
  { to: '/account', label: 'Account', icon: 'user' },
]

export default function BottomNav() {
  return (
    <nav className="nav" aria-label="Main">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className="nav__item"
        >
          <Icon name={item.icon} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
