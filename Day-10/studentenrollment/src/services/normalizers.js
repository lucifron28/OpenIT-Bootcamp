const read = (source, camelCaseKey, pascalCaseKey, fallback = '') =>
  source?.[camelCaseKey] ?? source?.[pascalCaseKey] ?? fallback

export const normalizeStudentRow = (student) => ({
  studentId: Number(read(student, 'studentId', 'StudentId', 0)),
  name: read(student, 'name', 'Name'),
  year: read(student, 'year', 'Year'),
  gender: read(student, 'gender', 'Gender'),
  program: read(student, 'program', 'Program'),
  section: read(student, 'section', 'Section'),
  avgGrade: read(student, 'avgGrade', 'AvgGrade', null),
  status: read(student, 'status', 'Status'),
})

export const normalizeStudentDetails = (student) => ({
  studentId: Number(read(student, 'studentId', 'StudentId', 0)),
  firstName: read(student, 'firstName', 'FirstName'),
  lastName: read(student, 'lastName', 'LastName'),
  year: read(student, 'year', 'Year'),
  gender: read(student, 'gender', 'Gender'),
  isEnrolled: read(student, 'isEnrolled', 'IsEnrolled', true),
})

export const normalizeProgram = (program) => ({
  id: Number(read(program, 'id', 'Id', 0)),
  name: read(program, 'name', 'Name'),
})

export const normalizeSection = (section) => ({
  id: Number(read(section, 'id', 'Id', 0)),
  code: read(section, 'code', 'Code'),
  year: read(section, 'year', 'Year'),
  programId: Number(read(section, 'programId', 'ProgramId', 0)),
})
