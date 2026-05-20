/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  createProgram,
  createSection,
  createStudent,
  deleteProgram,
  deleteSection,
  deleteStudent,
  getPrograms,
  getSections,
  getStudentById,
  getStudents,
  setStudentSection,
  updateProgram,
  updateSection,
  updateStudent,
} from '../services/Services'
import {
  normalizeProgram,
  normalizeSection,
  normalizeStudentDetails,
  normalizeStudentRow,
} from '../services/normalizers'

const StudentContext = createContext(null)

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [sections, setSections] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  const loadData = async () => {
    setStatus({ loading: true, error: '' })
    try {
      const [studentsData, programsData, sectionsData] = await Promise.all([
        getStudents(),
        getPrograms(),
        getSections(),
      ])

      setStudents((studentsData ?? []).map(normalizeStudentRow))
      setPrograms((programsData ?? []).map(normalizeProgram))
      setSections((sectionsData ?? []).map(normalizeSection))
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStudents([])
      setPrograms([])
      setSections([])
      setStatus({
        loading: false,
        error: error?.message || 'Failed to load enrollment data',
      })
    }
  }

  useEffect(() => {
    let isActive = true

    const loadInitialData = async () => {
      try {
        const [studentsData, programsData, sectionsData] = await Promise.all([
          getStudents(),
          getPrograms(),
          getSections(),
        ])

        if (!isActive) {
          return
        }

        setStudents((studentsData ?? []).map(normalizeStudentRow))
        setPrograms((programsData ?? []).map(normalizeProgram))
        setSections((sectionsData ?? []).map(normalizeSection))
        setStatus({ loading: false, error: '' })
      } catch (error) {
        if (!isActive) {
          return
        }

        setStudents([])
        setPrograms([])
        setSections([])
        setStatus({
          loading: false,
          error: error?.message || 'Failed to load enrollment data',
        })
      }
    }

    loadInitialData()

    return () => {
      isActive = false
    }
  }, [])

  const reload = async () => {
    await loadData()
  }

  const getStudentDetails = async (studentId) => {
    const student = await getStudentById(studentId)
    return normalizeStudentDetails(student)
  }

  const createStudentRecord = async (payload, sectionId) => {
    const created = await createStudent(payload)
    const studentId = created?.studentId ?? created?.StudentId

    if (studentId && sectionId) {
      await setStudentSection(studentId, sectionId)
    }

    await reload()
    return created
  }

  const updateStudentRecord = async (studentId, payload, sectionId) => {
    await updateStudent(studentId, payload)

    if (sectionId) {
      await setStudentSection(studentId, sectionId)
    }

    await reload()
  }

  const deleteStudentRecord = async (studentId) => {
    await deleteStudent(studentId)
    await reload()
  }

  const createProgramRecord = async (payload) => {
    await createProgram(payload)
    await reload()
  }

  const updateProgramRecord = async (programId, payload) => {
    await updateProgram(programId, payload)
    await reload()
  }

  const deleteProgramRecord = async (programId) => {
    await deleteProgram(programId)
    await reload()
  }

  const createSectionRecord = async (programId, payload) => {
    await createSection(programId, payload)
    await reload()
  }

  const updateSectionRecord = async (programId, sectionCode, payload) => {
    await updateSection(programId, sectionCode, payload)
    await reload()
  }

  const deleteSectionRecord = async (programId, sectionCode) => {
    await deleteSection(programId, sectionCode)
    await reload()
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        programs,
        sections,
        status,
        reload,
        getStudentDetails,
        createStudentRecord,
        updateStudentRecord,
        deleteStudentRecord,
        createProgramRecord,
        updateProgramRecord,
        deleteProgramRecord,
        createSectionRecord,
        updateSectionRecord,
        deleteSectionRecord,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)

  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider')
  }

  return context
}
