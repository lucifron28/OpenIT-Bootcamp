import { useStudentContext } from '../context/StudentContext'

export const useEnrollmentData = () => {
  return useStudentContext()
}
