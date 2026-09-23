import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import { STATUSES } from '../utils/statuses.js'

// Field order matches the wireframe: username, date of creation,
// biography (with its Edit button), then the app logo.
export default function Account({ profile, setProfile, books }) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile.bio)

  function handleSave() {
    setProfile((prev) => ({ ...prev, bio }))
    setEditing(false)
  }

  return (
    <section className="section">
      <h2>{profile.username}</h2>
      <p className="muted small">Reading since {profile.createdAt}</p>

      {editing ? (
        <>
          <textarea
            className="input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            aria-label="Biography"
          />
          <div className="actions">
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>{profile.bio}</p>
          <div className="actions">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        </>
      )}

      <div className="section">
        <Icon name="book-open" label="Booked Worm logo" className="icon" />
      </div>

      <div className="section status-grid">
        {STATUSES.map((status) => (
          <p key={status.id} className="muted small">
            {status.label}: {books.filter((b) => b.status === status.id).length}
          </p>
        ))}
      </div>
    </section>
  )
}
