import { useState } from 'react'
import { useEnrollmentData } from '../hooks/useEnrollmentData'

const emptyForm = {
  name: '',
}

function ProgramsPage() {
  const {
    programs,
    status,
    createProgramRecord,
    updateProgramRecord,
    deleteProgramRecord,
  } = useEnrollmentData()
  const [formStatus, setFormStatus] = useState({ submitting: false, error: '' })
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormStatus({ submitting: false, error: '' })
  }

  const handleEdit = (program) => {
    setForm({ name: program.name })
    setEditingId(program.id)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormStatus({ submitting: true, error: '' })

    if (!form.name.trim()) {
      setFormStatus({ submitting: false, error: 'Program name is required.' })
      return
    }

    try {
      if (editingId) {
        await updateProgramRecord(editingId, { name: form.name.trim() })
      } else {
        await createProgramRecord({ name: form.name.trim() })
      }
      resetForm()
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to save program',
      })
    }
  }

  const handleDelete = async (programId) => {
    const confirmed = window.confirm('Delete this program?')
    if (!confirmed) {
      return
    }

    setFormStatus({ submitting: true, error: '' })
    try {
      await deleteProgramRecord(programId)
      if (editingId === programId) {
        resetForm()
      }
      setFormStatus({ submitting: false, error: '' })
    } catch (error) {
      setFormStatus({
        submitting: false,
        error: error?.message || 'Failed to delete program',
      })
    }
  }

  const listMessage = status.loading
    ? 'Loading programs...'
    : status.error
      ? status.error
      : programs.length
        ? ''
        : 'No programs found.'

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <h2 className="crud-title">Programs</h2>
          <p className="crud-subtitle">Create, edit, and delete programs.</p>
        </div>
      </div>

      <div className="crud-card">
        <h3 className="crud-card-title">
          {editingId ? 'Edit Program' : 'Add Program'}
        </h3>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Program Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
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
              {editingId ? 'Update Program' : 'Create Program'}
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
        <h3 className="crud-card-title">Program List</h3>
        <div className="crud-table crud-table--programs">
          <div className="crud-table-head">
            <span>ID</span>
            <span>NAME</span>
            <span>ACTIONS</span>
          </div>
          <div className="crud-table-body">
            {listMessage ? (
              <div className="crud-table-row">
                <span className="crud-empty-row">{listMessage}</span>
              </div>
            ) : (
              programs.map((program) => (
                <div className="crud-table-row" key={program.id}>
                  <span>{program.id}</span>
                  <span>{program.name}</span>
                  <div className="crud-actions">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => handleEdit(program)}
                      disabled={formStatus.submitting}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDelete(program.id)}
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

export default ProgramsPage
