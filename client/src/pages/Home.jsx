import StatusCard from '../components/StatusCard.jsx'
import { STATUSES } from '../utils/statuses.js'

export default function Home({ books }) {
  return (
    <section className="section status-grid">
      {STATUSES.map((status) => (
        <StatusCard
          key={status.id}
          status={status.id}
          count={books.filter((book) => book.status === status.id).length}
        />
      ))}
    </section>
  )
}
