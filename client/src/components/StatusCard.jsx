import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getStatus } from '../utils/statuses.js'
import styles from './StatusCard.module.css'

// Molecule. One row per status on the Home screen (matches the wireframe:
// a stacked list, not a grid). Props: status, count.
export default function StatusCard({ status, count }) {
  const info = getStatus(status)
  if (!info) return null

  return (
    <Link to={`/shelf/${status}`} className={styles.row}>
      <div className={`cover ${styles.cover}`} aria-hidden="true" />
      <span className={styles.text}>
        <span className={styles.name}>
          <Icon name={info.icon} /> {info.label}
        </span>
        <span className={styles.count}>
          {count} {count === 1 ? 'book' : 'books'}
        </span>
      </span>
    </Link>
  )
}
