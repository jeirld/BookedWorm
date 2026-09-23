import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getStatus } from '../utils/statuses.js'

// Molecule. One per status on the Home screen. Props: status, count.
export default function StatusCard({ status, count }) {
  const info = getStatus(status)
  if (!info) return null

  return (
    <Link to={`/shelf/${status}`} className="status-card">
      <div className="status-card__covers" aria-hidden="true">
        <div className="cover" />
        <div className="cover" />
        <div className="cover" />
      </div>
      <div className="status-card__tab">
        <Icon name={info.icon} />
        <span className="status-card__text">
          <span className="status-card__name">{info.label}</span>
          <span className="status-card__count">
            {count} {count === 1 ? 'book' : 'books'}
          </span>
        </span>
      </div>
    </Link>
  )
}
