import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getStatus, STATUSES } from '../utils/statuses.js'
import { getSpineColor } from '../utils/spine.js'
import styles from './StatusCard.module.css'

// Molecule. One row per status on the Home screen (matches the wireframe:
// a stacked list, not a grid). Props: status, count.
export default function StatusCard({ status, count }) {
  const info = getStatus(status)
  if (!info) return null

  // Each status gets a different cloth colour for its back cover, using
  // the same palette BookSpine already draws from -- one consistent
  // accent system, not a new colour introduced just for this row.
  const index = STATUSES.findIndex((s) => s.id === status)
  const backTint = getSpineColor(index)

  return (
    <Link to={`/shelf/${status}`} className={styles.row}>
      <div className={styles.covers} aria-hidden="true">
        <div className={`cover ${styles.coverBack}`} style={{ '--cover-bg': backTint }} />
        <div className={`cover ${styles.coverFront}`} />
      </div>
      <span className={styles.text}>
        <span className={styles.name}>
          <Icon name={info.icon} /> {info.label}
        </span>
        <span className={styles.count}>
          {count} {count === 1 ? 'book' : 'books'}
        </span>
      </span>
      <Icon name="chevron-right" className={`icon ${styles.chevron}`} />
    </Link>
  )
}
