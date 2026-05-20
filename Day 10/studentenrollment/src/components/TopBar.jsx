
function TopBar({ auth, onLoginClick, onRegisterClick, onLogoutClick }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="topbar-title">Enrollment System</div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-meta">Open IT Fullstack Development Bootcamp 2026</div>
        {auth?.isAuthenticated ? (
          <div className="topbar-auth">
            <span className="topbar-user">{auth.email}</span>
            <button className="topbar-button" type="button" onClick={onLogoutClick}>
              Logout
            </button>
          </div>
        ) : (
          <div className="topbar-auth">
            <button className="topbar-button" type="button" onClick={onLoginClick}>
              Login
            </button>
            <button className="topbar-button topbar-button-secondary" type="button" onClick={onRegisterClick}>
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
