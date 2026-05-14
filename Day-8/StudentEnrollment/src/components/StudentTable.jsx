const formatGrade = (value) => {
    if (Number.isFinite(value)) {
        return value.toFixed(2);
    }

    return "0.00";
};

export const StudentTable = ({ students, onSelectStudent }) => {
    const handleKeyDown = (event, student) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectStudent(student);
        }
    };

    return (
        <section className="table-card">
            <table className="students-table">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>YEAR</th>
                        <th>GENDER</th>
                        <th>PROGRAM</th>
                        <th>SECTION</th>
                        <th>AVG GRADE</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td className="empty-cell" colSpan={7}>
                                No students found.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr
                                key={student.id}
                                className="table-row"
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectStudent(student)}
                                onKeyDown={(event) => handleKeyDown(event, student)}
                            >
                                <td data-label="Name">{student.name}</td>
                                <td data-label="Year">{student.year}</td>
                                <td data-label="Gender">{student.gender}</td>
                                <td data-label="Program">{student.program}</td>
                                <td data-label="Section">{student.section}</td>
                                <td data-label="Avg Grade">{formatGrade(student.avgGrade)}</td>
                                <td data-label="Status">
                                    <span
                                        className={`status-pill ${
                                            student.status === "Enrolled" ? "is-active" : "is-pending"
                                        }`}
                                    >
                                        {student.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
};
