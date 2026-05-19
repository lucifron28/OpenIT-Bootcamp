import { useEffect, useState } from 'react'
import {
  createSection,
  deleteSection,
  getPrograms,
  getSections,
  updateSection,
} from '../services/Services'

const emptyForm = {
  programId: '',
  code: '',
  year: '',
}

const normalizeSection = (section) => ({
  id: section.id ?? section.Id ?? '',
  code: section.code ?? section.Code ?? '',
  year: section.year ?? section.Year ?? '',
  programId: Number(section.programId ?? section.ProgramId ?? 0),
})

const normalizeProgram = (program) => ({
  id: Number(program.id ?? program.Id ?? 0),
  name: program.name ?? program.Name ?? '',
})

function SectionsPage() {
  const [sections, setSections] = useState([])
  const [programs, setPrograms] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })
  const [formStatus, setFormStatus] = useState({ submitting: false, error: '' })
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)

  const programMap = new Map(programs.map((program) => [program.id, program.name]))

  const loadData = async () => {
    setStatus({ loading: true, error: '' })
    try {
      const [sectionsData, programsData] = await Promise.all([
        getSections(),
        getPrograms(),
      ])
      setSections(sectionsData.map(normalizeSection))
      setPrograms(programsData.map(normalizeProgram))
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setSections([])
      setPrograms([])
      setStatus({
        loading: false,
        error: error?.message || 'Failed to load sections',
      })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setFormStatus({ submitting: false, error: '' })
  }

  const handleEdit = (section) => {
    setForm({
      programId: String(section.programId),
      code: section.code,
      year: String(section.year),
    })
    setEditing({ programId: section.programId, code: section.code })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormStatus({ submitting: true, error: '' })

    const yearValue = Number(form.year)
    const programValue = Number(form.programId)

    if (!form.code.trim()) {
      setFormStatus({ submitting: false, error: 'Section code is required.' })
      return
    }

    if (!Number.isFinite(yearValue) || yearValue <= 0) {
      setFormStatus({ submitting: false, error: 'Year must be a valid number.' })
      return
    }

    if (!editing && (!Number.isFinite(programValue) || programValue <= 0)) {
      setFormStatus({ submitting: false, error: 'Program is required.' })
      return
    }

    const payload = {
      code: form.code.trim(),
      year: yearValue,
      programId: editing ? editing.programId : programValue,
    }

    try {
      if (editing) {
        await updateSection(editing.programId, editing.code, payload)
      } else {
        await createSection(programValue, payload)
      }
      await loadData()
      resetForm()
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to save section',
      })
    }
  }

  const handleDelete = async (section) => {
    const confirmed = window.confirm('Delete this section?')
    if (!confirmed) {
      return
    }

    setFormStatus({ submitting: true, error: '' })
    try {
      await deleteSection(section.programId, section.code)
      await loadData()
      if (editing && editing.programId === section.programId && editing.code === section.code) {
        resetForm()
      }
      setFormStatus({ submitting: false, error: '' })
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to delete section',
      })
    }
  }

  const listMessage = status.loading
    ? 'Loading sections...'
    : status.error
      ? status.error
      : sections.length
        ? ''
        : 'No sections found.'

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Sections</h2>
          <p className="crud-subtitle">Create, edit, and delete sections.</p>
        </div>
      </div>

      <div className="crud-card">
        <h3 className="crud-card-title">
          {editing ? 'Edit Section' : 'Add Section'}
        </h3>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Program</span>
              <select
                value={form.programId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, programId: event.target.value }))
                }
                disabled={Boolean(editing)}
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
              <span>Section Code</span>
              <input
                type="text"
                value={form.code}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, code: event.target.value }))
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
          </div>
          {formStatus.error ? (
            <div className="crud-alert error">{formStatus.error}</div>
          ) : null}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={formStatus.submitting}>
              {editing ? 'Update Section' : 'Create Section'}
            </button>
            {editing ? (
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
        <h3 className="crud-card-title">Section List</h3>
        <div className="crud-table crud-table--sections">
          <div className="crud-table-head">
            <span>ID</span>
            <span>CODE</span>
            <span>YEAR</span>
            <span>PROGRAM</span>
            <span>ACTIONS</span>
          </div>
          <div className="crud-table-body">
            {listMessage ? (
              <div className="crud-table-row">
                <span className="crud-empty-row">{listMessage}</span>
              </div>
            ) : (
              sections.map((section) => (
                <div className="crud-table-row" key={section.id}>
                  <span>{section.id}</span>
                  <span>{section.code}</span>
                  <span>{section.year}</span>
                  <span>{programMap.get(section.programId) || section.programId}</span>
                  <div className="crud-actions">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => handleEdit(section)}
                      disabled={formStatus.submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDelete(section)}
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

export default SectionsPage
