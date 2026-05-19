import enrollmentLogo from '../assets/enrollment-logo.svg'

function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img src={enrollmentLogo} alt="" className="topbar-logo" />
        <div className="topbar-title">Enrollment System</div>
      </div>
      <div className="topbar-meta">Open IT Fullstack Development Bootcamp 2026</div>
    </header>
  )
}

export default TopBar
