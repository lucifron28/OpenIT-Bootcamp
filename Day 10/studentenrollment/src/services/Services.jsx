const API_BASE = (() => {
    const origin = window.location.origin
    const isLocalHost =
        origin.includes('localhost:') || origin.includes('127.0.0.1:')

    if (isLocalHost && !origin.includes('localhost:5001') && !origin.includes('127.0.0.1:5001')) {
        return 'http://localhost:5001'
    }

    return origin
})()

const API_URL = `${API_BASE}/api`

const buildUrl = (path) =>
    `${API_URL}${path.startsWith('/') ? path : `/${path}`}`

const buildRootUrl = (path) =>
    `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

const requestJson = async (path, options = {}) => {
    const { root, headers, ...requestOptions } = options
    const url = root ? buildRootUrl(path) : buildUrl(path)
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
            ...(headers ?? {}),
        },
        ...requestOptions,
    })

    if (!response.ok) {
        const message = await response.text().catch(() => '')
        throw new Error(message || 'Request failed')
    }

    if (response.status === 204) {
        return null
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
        return null
    }

    return response.json()
}

export const login = async (credentials) =>
    requestJson('/login?useCookies=true', {
        method: 'POST',
        body: JSON.stringify(credentials),
        root: true,
    })

export const register = async (credentials) =>
    requestJson('/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
        root: true,
    })

export const logout = async () =>
    requestJson('/logout', {
        method: 'POST',
        root: true,
    })

export const getCurrentUser = async () =>
    requestJson('/manage/info', {
        root: true,
    })

export const getStudents = async () => requestJson('/students')

export const getStudentById = async (id) =>
    requestJson(`/students/${id}`)

export const createStudent = async (student) =>
    requestJson('/students', {
        method: 'POST',
        body: JSON.stringify(student),
    })

export const updateStudent = async (id, student) =>
    requestJson(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(student),
    })

export const deleteStudent = async (id) =>
    requestJson(`/students/${id}`, {
        method: 'DELETE',
    })

export const setStudentSection = async (studentId, sectionId) =>
    requestJson(`/students/${studentId}/section/${sectionId}`, {
        method: 'PUT',
    })

export const getPrograms = async () => requestJson('/programs')

export const getProgramById = async (id) =>
    requestJson(`/programs/${id}`)

export const createProgram = async (program) =>
    requestJson('/programs', {
        method: 'POST',
        body: JSON.stringify(program),
    })

export const updateProgram = async (id, program) =>
    requestJson(`/programs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(program),
    })

export const deleteProgram = async (id) =>
    requestJson(`/programs/${id}`, {
        method: 'DELETE',
    })

export const getSections = async () => requestJson('/sections')

export const getSectionsByProgram = async (programId) =>
    requestJson(`/programs/${programId}/sections`)

export const getSectionByCode = async (programId, sectionCode) =>
    requestJson(`/programs/${programId}/sections/${sectionCode}`)

export const createSection = async (programId, section) =>
    requestJson(`/programs/${programId}/sections`, {
        method: 'POST',
        body: JSON.stringify(section),
    })

export const updateSection = async (programId, sectionCode, section) =>
    requestJson(`/programs/${programId}/sections/${sectionCode}`, {
        method: 'PUT',
        body: JSON.stringify(section),
    })

export const deleteSection = async (programId, sectionCode) =>
    requestJson(`/programs/${programId}/sections/${sectionCode}`, {
        method: 'DELETE',
    })

export const getStudentByProgramSectionAndStudent = async (
    programId,
    sectionCode,
    studentId,
) =>
    requestJson(
        `/programs/${programId}/sections/${sectionCode}/student/${studentId}`,
    )
