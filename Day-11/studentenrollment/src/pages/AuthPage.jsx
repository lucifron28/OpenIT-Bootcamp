import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { useEnrollmentData } from '../hooks/useEnrollmentData'

function AuthPage({ mode, onModeChange, onAuthenticated }) {
  const { auth, loginUser, registerUser } = useEnrollmentData()
  const isRegister = mode === 'register'

  const handleLogin = async (email, password) => {
    await loginUser(email, password)
    onAuthenticated()
  }

  const handleRegister = async (email, password) => {
    await registerUser(email, password)
    onAuthenticated()
  }

  return (
    <div className="crud-page auth-page">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">{isRegister ? 'Register' : 'Login'}</h2>
          <p className="crud-subtitle">
            {isRegister
              ? 'Create an account to manage enrollment records.'
              : 'Login to create, update, and delete enrollment records.'}
          </p>
        </div>
      </div>

      <div className="crud-card auth-card">
        <h3 className="crud-card-title">
          {isRegister ? 'Create Account' : 'Account Login'}
        </h3>
        {isRegister ? (
          <RegisterForm
            auth={auth}
            onRegister={handleRegister}
            onSwitchMode={() => onModeChange('login')}
          />
        ) : (
          <LoginForm
            auth={auth}
            onLogin={handleLogin}
            onSwitchMode={() => onModeChange('register')}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
