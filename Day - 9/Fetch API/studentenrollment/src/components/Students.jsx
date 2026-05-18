import { useState, useEffect } from "react";

const Students = () => {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/students');
            const data = await response.json();
            console.log(data);
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Students</h2>
            {students.map((student) => (
                <div key={student.studentId}>
                    <p>{student.firstName} {student.lastName}</p>
                </div>
            ))}
        </div>
    );
}

export default Students; 