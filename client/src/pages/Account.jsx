import { useEffect, useState } from 'react'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import { STATUSES } from '../utils/statuses.js'
import * as api from '../api/index.js'
import logo from '../assets/logo.svg'

export default function Account({ profile, updateProfile, onLogout, onDeleteAccount }) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(profile.bio)
  const [saving, setSaving] = useState(false)
  const [counts, setCounts] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [password, setPassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    api.getStats().then(setCounts).catch(() => {})
  }, [])

  async function handleSave() {
    setSaving(true)
    await updateProfile({ bio })
    setSaving(false)
    setEditing(false)
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')
    try {
      await onDeleteAccount(password)
    } catch (error) {
      setDeleteError(error.message)
      setDeleting(false)
    }
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
            {status.label}: {counts ? counts[status.id] ?? 0 : '...'}
          </p>
        ))}
      </div>

      <div className="panel">
        {confirmingDelete ? (
          <>
            <p>
              This permanently deletes your account, your books and your notes. Type your password to confirm.
            </p>
            <FormField
              label="Password"
              id="delete-password"
              type="password"
              value={password}
              onChange={setPassword}
              error={deleteError}
            />
            <div className="actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmingDelete(false)
                  setPassword('')
                  setDeleteError('')
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDelete} disabled={deleting || !password}>
                {deleting ? 'Deleting...' : 'Delete my account'}
              </Button>
            </div>
          </>
        ) : (
          <div className="actions">
            <Button variant="secondary" onClick={onLogout}>
              Log out
            </Button>
            <Button variant="secondary" onClick={() => setConfirmingDelete(true)}>
              Delete account
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
