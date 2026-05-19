import { useEffect, useState } from 'react'
import './App.css'
import BottomBar from './components/BottomBar'
import FiltersBar from './components/FiltersBar'
import StatsPanel from './components/StatsPanel'
import StudentsTable from './components/StudentsTable'
import TopBar from './components/TopBar'
import { getStudents } from './Services'
import ProgramsPage from './pages/ProgramsPage'
import SectionsPage from './pages/SectionsPage'
import StudentsPage from './pages/StudentsPage'

const normalizeStudent = (student) => ({
  name: student.name ?? student.Name ?? '',
  year: student.year ?? student.Year ?? '',
  gender: student.gender ?? student.Gender ?? '',
  program: student.program ?? student.Program ?? '',
  section: student.section ?? student.Section ?? '',
  avgGrade: student.avgGrade ?? student.AvgGrade ?? null,
  status: student.status ?? student.Status ?? '',
})

function App() {
  const [students, setStudents] = useState([])
  const [searchText, setSearchText] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [status, setStatus] = useState({ loading: true, error: '' })
  const [activePage, setActivePage] = useState('overview')

  useEffect(() => {
    let isActive = true

    const loadStudents = async () => {
      setStatus({ loading: true, error: '' })
      try {
        const data = await getStudents()
        if (!isActive) {
          return
        }

        setStudents(data.map(normalizeStudent))
        setStatus({ loading: false, error: '' })
      } catch (error) {
        if (!isActive) {
          return
        }

        setStudents([])
        setStatus({
          loading: false,
          error: error?.message || 'Failed to load students',
        })
      }
    }

    loadStudents()

    return () => {
      isActive = false
    }
  }, [])

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
