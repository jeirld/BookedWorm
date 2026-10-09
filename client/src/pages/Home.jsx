import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusCard from '../components/StatusCard.jsx'
import StatusTag from '../components/StatusTag.jsx'
import { STATUSES } from '../utils/statuses.js'
import * as api from '../api/index.js'
import styles from './Home.module.css'

export default function Home({ books }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState(null)

  useEffect(() => {
    const text = term.trim()
    if (!text) {
      setResults(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      api
        .searchBooks(text)
        .then((found) => {
          if (!cancelled) setResults(found)
        })
        .catch(() => {})
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [term])

  return (
    <section className="section">
      <input
        type="search"
        className="input"
        placeholder="Search by title or author"
        aria-label="Search books"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {results ? (
        <div className="panel">
          {results.length === 0 ? (
            <p className="muted">No books match "{term.trim()}".</p>
          ) : (
            results.map((book) => (
              <p key={book.id}>
                <Link to={`/books/${book.id}`}>{book.title}</Link>
                <span className="muted small"> by {book.author} </span>
                <StatusTag status={book.status} />
              </p>
            ))
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {STATUSES.map((status) => (
            <StatusCard
              key={status.id}
              status={status.id}
              count={books.filter((book) => book.status === status.id).length}
            />
          ))}
        </div>
      )}
    </section>
  )
}
