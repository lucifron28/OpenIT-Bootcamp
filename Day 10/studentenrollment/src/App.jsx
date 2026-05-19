import { useState } from 'react'
import './styles/App.css'
import BottomBar from './components/BottomBar'
import FiltersBar from './components/FiltersBar'
import StatsPanel from './components/StatsPanel'
import StudentsTable from './components/StudentsTable'
import TopBar from './components/TopBar'
import { useEnrollmentData } from './hooks/useEnrollmentData'
import ProgramsPage from './pages/ProgramsPage'
import SectionsPage from './pages/SectionsPage'
import StudentsPage from './pages/StudentsPage'

function App() {
  const { students, status } = useEnrollmentData()
  const [searchText, setSearchText] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [activePage, setActivePage] = useState('overview')

  const programOptions = Array.from(
    new Set(students.map((student) => student.program).filter(Boolean)),
  ).sort()

  const yearOptions = Array.from(
    new Set(students.map((student) => student.year).filter(Boolean)),
  ).sort((a, b) => a - b)

  const searchValue = searchText.trim().toLowerCase()
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchValue || student.name.toLowerCase().includes(searchValue)
    const matchesProgram = !programFilter || student.program === programFilter
    const matchesYear = !yearFilter || student.year.toString() === yearFilter

    return matchesSearch && matchesProgram && matchesYear
  })

  const total = filteredStudents.length
  const enrolled = filteredStudents.filter(
    (student) => student.status.toLowerCase() === 'enrolled',
  ).length
  const programs =
    new Set(filteredStudents.map((student) => student.program).filter(Boolean)).size
  const grades = filteredStudents
    .map((student) => student.avgGrade)
    .filter((grade) => typeof grade === 'number')
  const avgGrade = grades.length
    ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
    : '-'
  const stats = { total, enrolled, programs, avgGrade }

  let tableMessage = 'No data loaded.'
  if (status.loading) {
    tableMessage = 'Loading students...'
  } else if (status.error) {
    tableMessage = status.error
  } else if (!students.length) {
    tableMessage = 'No students found.'
  } else if (!filteredStudents.length) {
    tableMessage = 'No matching students.'
  }

  const renderMainContent = () => {
    if (activePage === 'students') {
      return <StudentsPage />
    }
    if (activePage === 'programs') {
      return <ProgramsPage />
    }
    if (activePage === 'sections') {
      return <SectionsPage />
    }

    return (
      <>
        <StatsPanel stats={stats} />
        <FiltersBar
          searchText={searchText}
          onSearchChange={setSearchText}
          programFilter={programFilter}
          onProgramChange={setProgramFilter}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
          programOptions={programOptions}
          yearOptions={yearOptions}
        />
        <StudentsTable students={filteredStudents} message={tableMessage} />
      </>
    )
  }

  return (
    <>
      <TopBar />

      <nav className="page-nav">
        <button
          type="button"
          className={activePage === 'overview' ? 'active' : ''}
          onClick={() => setActivePage('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={activePage === 'students' ? 'active' : ''}
          onClick={() => setActivePage('students')}
        >
          Students
        </button>
        <button
          type="button"
          className={activePage === 'programs' ? 'active' : ''}
          onClick={() => setActivePage('programs')}
        >
          Programs
        </button>
        <button
          type="button"
          className={activePage === 'sections' ? 'active' : ''}
          onClick={() => setActivePage('sections')}
        >
          Sections
        </button>
      </nav>

      <main className="page">
        {renderMainContent()}
      </main>

      <BottomBar />
    </>
  )
}

export default App
