import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!username.trim()) nextErrors.username = 'Username is required.'
    if (!password) nextErrors.password = 'Password is required.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await onLogin({ username, password })
    } catch (error) {
      setFormError(error.message)
      setSaving(false)
    }
  }

  return (
    <section className="section">
      <h2>Log in</h2>
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
        {formError && (
          <p className="field__error" role="alert">
            <Icon name="x-circle" label="Error" />
            {formError}
          </p>
        )}
        <div className="actions">
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Logging in...' : 'Log in'}
          </Button>
        </div>
        <p className="muted small">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </section>
  )
}
