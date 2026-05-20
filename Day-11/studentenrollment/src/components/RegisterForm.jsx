import { useState } from 'react'

function RegisterForm({ auth, onRegister, onSwitchMode }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [status, setStatus] = useState({ submitting: false, error: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ submitting: true, error: '' })

    if (!form.email.trim() || !form.password || !form.confirmPassword) {
      setStatus({ submitting: false, error: 'All fields are required.' })
      return
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ submitting: false, error: 'Passwords do not match.' })
      return
    }

    try {
      await onRegister(form.email.trim(), form.password)
      setStatus({ submitting: false, error: '' })
    } catch (error) {
      setStatus({
        submitting: false,
        error: error?.message || 'Failed to register.',
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
        <label className="form-field">
          <span>Confirm Password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
            }
            placeholder="Confirm your password"
            required
          />
        </label>
      </div>
      {status.error || auth?.error ? (
        <div className="crud-alert error">{status.error || auth.error}</div>
      ) : null}
      <div className="form-actions auth-actions">
        <button className="btn" type="submit" disabled={status.submitting || auth?.checking}>
          {status.submitting || auth?.checking ? 'Creating account...' : 'Register'}
        </button>
        <button className="btn btn-secondary" type="button" onClick={onSwitchMode}>
          Back to login
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
