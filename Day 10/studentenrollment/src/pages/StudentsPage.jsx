import { useEffect, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  getPrograms,
  getSections,
  getStudentById,
  getStudents,
  setStudentSection,
  updateStudent,
} from '../services/Services'

const emptyForm = {
  firstName: '',
  lastName: '',
  year: '',
  gender: '',
  programId: '',
  sectionId: '',
  isEnrolled: true,
}

const normalizeStudentRow = (student) => ({
  studentId:
    student.studentId ?? student.StudentId ?? student.id ?? student.Id ?? '',
  name: student.name ?? student.Name ?? '',
  year: student.year ?? student.Year ?? '',
  gender: student.gender ?? student.Gender ?? '',
  program: student.program ?? student.Program ?? '',
  section: student.section ?? student.Section ?? '',
  status: student.status ?? student.Status ?? '',
})

const normalizeStudentForm = (student) => ({
  firstName: student.firstName ?? student.FirstName ?? '',
  lastName: student.lastName ?? student.LastName ?? '',
  year: student.year ?? student.Year ?? '',
  gender: student.gender ?? student.Gender ?? '',
  isEnrolled: student.isEnrolled ?? student.IsEnrolled ?? true,
})

const normalizeProgram = (program) => ({
  id: Number(program.id ?? program.Id ?? 0),
  name: program.name ?? program.Name ?? '',
})

const normalizeSection = (section) => ({
  id: Number(section.id ?? section.Id ?? 0),
  code: section.code ?? section.Code ?? '',
  programId: Number(section.programId ?? section.ProgramId ?? 0),
})

function StudentsPage() {
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [sections, setSections] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })
  const [formStatus, setFormStatus] = useState({ submitting: false, error: '' })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const loadData = async () => {
    setStatus({ loading: true, error: '' })
    try {
      const [studentsData, programsData, sectionsData] = await Promise.all([
        getStudents(),
        getPrograms(),
        getSections(),
      ])
      setStudents(studentsData.map(normalizeStudentRow))
      setPrograms(programsData.map(normalizeProgram))
      setSections(sectionsData.map(normalizeSection))
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStudents([])
      setPrograms([])
      setSections([])
      setStatus({
        loading: false,
        error: error?.message || 'Failed to load students',
      })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormStatus({ submitting: false, error: '' })
  }

  const handleEdit = async (student) => {
    setFormStatus({ submitting: true, error: '' })
    try {
      const data = await getStudentById(student.studentId)
      const programId = programs.find((program) => program.name === student.program)?.id ?? ''
      const sectionId = programId
        ? sections.find(
            (section) => section.programId === programId && section.code === student.section,
          )?.id ?? ''
        : ''

      setForm({
        ...normalizeStudentForm(data),
        programId: programId ? String(programId) : '',
        sectionId: sectionId ? String(sectionId) : '',
      })
      setEditingId(student.studentId)
      setFormStatus({ submitting: false, error: '' })
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to load student',
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormStatus({ submitting: true, error: '' })

    const yearValue = Number(form.year)
    const programIdValue = Number(form.programId)
    const sectionIdValue = Number(form.sectionId)
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormStatus({ submitting: false, error: 'First and last name are required.' })
      return
    }

    if (!Number.isFinite(yearValue) || yearValue <= 0) {
      setFormStatus({ submitting: false, error: 'Year must be a valid number.' })
      return
    }

    if (!Number.isFinite(programIdValue) || programIdValue <= 0) {
      setFormStatus({ submitting: false, error: 'Program is required.' })
      return
    }

    if (!Number.isFinite(sectionIdValue) || sectionIdValue <= 0) {
      setFormStatus({ submitting: false, error: 'Section is required.' })
      return
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      year: yearValue,
      gender: form.gender.trim(),
      isEnrolled: form.isEnrolled,
    }

    try {
      let studentId = editingId
      if (editingId) {
        await updateStudent(editingId, payload)
      } else {
        const created = await createStudent(payload)
        studentId = created?.studentId ?? created?.StudentId
      }

      if (!studentId) {
        throw new Error('Failed to save student')
      }

      await setStudentSection(studentId, sectionIdValue)
      await loadData()
      resetForm()
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to save student',
      })
    }
  }

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm('Delete this student record?')
    if (!confirmed) {
      return
    }

    setFormStatus({ submitting: true, error: '' })
    try {
      await deleteStudent(studentId)
      await loadData()
      if (editingId === studentId) {
        resetForm()
      }
      setFormStatus({ submitting: false, error: '' })
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to delete student',
      })
    }
  }

  const listMessage = status.loading
    ? 'Loading students...'
    : status.error
      ? status.error
      : students.length
        ? ''
        : 'No students found.'

  const selectedProgramId = Number(form.programId)
  const sectionOptions =
    Number.isFinite(selectedProgramId) && selectedProgramId > 0
      ? sections.filter((section) => section.programId === selectedProgramId)
      : []

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Students</h2>
          <p className="crud-subtitle">Create, edit, and delete student records.</p>
        </div>
      </div>

      <div className="crud-card">
        <h3 className="crud-card-title">
          {editingId ? 'Edit Student' : 'Add Student'}
        </h3>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>First Name</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, firstName: event.target.value }))
                }
                required
              />
            </label>
            <label className="form-field">
              <span>Last Name</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lastName: event.target.value }))
                }
                required
              />
            </label>
            <label className="form-field">
              <span>Year</span>
              <input
                type="number"
                min="1"
                value={form.year}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, year: event.target.value }))
                }
                required
              />
            </label>
            <label className="form-field">
              <span>Gender</span>
              <input
                type="text"
                value={form.gender}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, gender: event.target.value }))
                }
                required
              />
            </label>
            <label className="form-field">
              <span>Program</span>
              <select
                value={form.programId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    programId: event.target.value,
                    sectionId: '',
                  }))
                }
                required
              >
                <option value="">Select program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Section</span>
              <select
                value={form.sectionId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sectionId: event.target.value }))
                }
                disabled={!form.programId}
                required
              >
                <option value="">Select section</option>
                {sectionOptions.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.code}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Status</span>
              <select
                value={form.isEnrolled ? 'true' : 'false'}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isEnrolled: event.target.value === 'true',
                  }))
                }
              >
                <option value="true">Enrolled</option>
                <option value="false">Not Enrolled</option>
              </select>
            </label>
          </div>
          {formStatus.error ? (
            <div className="crud-alert error">{formStatus.error}</div>
          ) : null}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={formStatus.submitting}>
              {editingId ? 'Update Student' : 'Create Student'}
            </button>
            {editingId ? (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={formStatus.submitting}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="crud-card">
        <h3 className="crud-card-title">Student List</h3>
        <div className="crud-table crud-table--students">
          <div className="crud-table-head">
            <span>ID</span>
            <span>NAME</span>
            <span>YEAR</span>
            <span>GENDER</span>
            <span>PROGRAM</span>
            <span>SECTION</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          <div className="crud-table-body">
            {listMessage ? (
              <div className="crud-table-row">
                <span className="crud-empty-row">{listMessage}</span>
              </div>
            ) : (
              students.map((student) => (
                <div className="crud-table-row" key={student.studentId}>
                  <span>{student.studentId}</span>
                  <span>{student.name}</span>
                  <span>{student.year}</span>
                  <span>{student.gender}</span>
                  <span>{student.program || '-'}</span>
                  <span>{student.section || '-'}</span>
                  <span>{student.status || '-'}</span>
                  <div className="crud-actions">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => handleEdit(student)}
                      disabled={formStatus.submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDelete(student.studentId)}
                      disabled={formStatus.submitting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentsPage
