import { useState } from 'react'
import Button from '../components/Button.jsx'
import { STATUSES } from '../utils/statuses.js'
import logo from '../assets/logo.svg'

// Field order matches the wireframe: username, date of creation,
// biography (with its Edit button), then the app logo. Content sits in
// a `panel` (see layout.css) for the same lifted-card feel as the rest
// of the app.
export default function Account({ profile, updateProfile, books }) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile.bio)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await updateProfile({ bio })
    setSaving(false)
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
              <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
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

        <img src={logo} alt="Booked Worm logo" width="120" height="120" style={{ display: 'block' }} />
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
