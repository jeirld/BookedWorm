import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getStatus, STATUSES } from '../utils/statuses.js'
import { getSpineColor } from '../utils/spine.js'
import styles from './StatusCard.module.css'

export default function StatusCard({ status, count }) {
  const info = getStatus(status)
  if (!info) return null

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
