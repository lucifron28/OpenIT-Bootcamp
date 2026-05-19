import { CreateContext, UseContext } from "react";

const StudentContext = CreateContext();


export const StudentProvider = ({ children }) => {
  const [students, setStudents] = UseState([]);
  const [programs, setPrograms] = UseState([]);
  const [sections, setSections] = UseState([]);

    return (
        <StudentContext.Provider 
        value={{ students, setStudents, programs, setPrograms, sections, setSections }}>
            {children}
        </StudentContext.Provider>
    )
}

export const useStudentContext = () => {
    const context = UseContext(StudentContext);
    if (!context) {
        throw new Error("useStudentContext must be used within a StudentProvider");
    }
    return context;
}