import StatusCard from '../components/StatusCard.jsx'
import { STATUSES } from '../utils/statuses.js'
import styles from './Home.module.css'

export default function Home({ books }) {
  return (
    <section className="section">
      <div className={styles.list}>
        {STATUSES.map((status) => (
          <StatusCard
            key={status.id}
            status={status.id}
            count={books.filter((book) => book.status === status.id).length}
          />
        ))}
      </div>
    </section>
  )
}
