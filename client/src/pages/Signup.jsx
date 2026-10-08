import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    const name = username.trim()
    if (name.length < 3 || name.length > 30) nextErrors.username = 'Use 3 to 30 characters.'
    else if (!/^[A-Za-z0-9_.-]+$/.test(name)) {
      nextErrors.username = 'Letters, numbers, dots, dashes and underscores only.'
    }
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (confirm !== password) nextErrors.confirm = 'Passwords do not match.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await onSignup({ username: name, password })
    } catch (error) {
      setFormError(error.message)
      setSaving(false)
    }
  }

  return (
    <section className="section">
      <h2>Create an account</h2>
      <form className="panel" onSubmit={handleSubmit}>
        <FormField label="Username" id="username" value={username} onChange={setUsername} error={errors.username} />
        <FormField
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <FormField
          label="Confirm password"
          id="confirm"
          type="password"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
        />
        {formError && (
          <p className="field__error" role="alert">
            <Icon name="x-circle" label="Error" />
            {formError}
          </p>
        )}
        <div className="actions">
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Sign up'}
          </Button>
        </div>
        <p className="muted small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  )
}
