import { useState } from 'react'

function LoginForm({ auth, onLogin, onSwitchMode }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ submitting: false, error: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ submitting: true, error: '' })

    if (!form.email.trim() || !form.password) {
      setStatus({ submitting: false, error: 'Email and password are required.' })
      return
    }

    try {
      await onLogin(form.email.trim(), form.password)
      setStatus({ submitting: false, error: '' })
    } catch (error) {
      setStatus({
        submitting: false,
        error: error?.message || 'Failed to login.',
      })
    }
  }

  return (
    <form className="crud-form auth-form" onSubmit={handleSubmit}>
      <div className="form-grid auth-form-grid">
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="Enter your password"
            required
          />
        </label>
      </div>
      {status.error || auth?.error ? (
        <div className="crud-alert error">{status.error || auth.error}</div>
      ) : null}
      <div className="form-actions auth-actions">
        <button className="btn" type="submit" disabled={status.submitting || auth?.checking}>
          {status.submitting || auth?.checking ? 'Logging in...' : 'Login'}
        </button>
        <button className="btn btn-secondary" type="button" onClick={onSwitchMode}>
          Create account
        </button>
      </div>
    </form>
  )
}

export default LoginForm
