import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import Button from '../components/Button.jsx'
import { STATUSES } from '../utils/statuses.js'

// Field order matches the wireframe: username, date of creation,
// biography (with its Edit button), then the app logo. Content sits in
// a `panel` (see layout.css) for the same lifted-card feel as the rest
// of the app.
export default function Account({ profile, setProfile, books }) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile.bio)

  function handleSave() {
    setProfile((prev) => ({ ...prev, bio }))
    setEditing(false)
  }

  return (
    <section className="section">
      <div className="panel">
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

        <Icon name="book-open" label="Booked Worm logo" className="icon" />
      </div>

      <div className="panel status-grid">
        {STATUSES.map((status) => (
          <p key={status.id} className="muted small">
            {status.label}: {books.filter((b) => b.status === status.id).length}
          </p>
        ))}
      </div>
    </section>
  )
}
