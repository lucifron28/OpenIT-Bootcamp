function StudentsTable({ students, message }) {
  const rows = students ?? []

  return (
    <section className="table">
      <div className="table-head">
        <span>NAME</span>
        <span>YEAR</span>
        <span>GENDER</span>
        <span>PROGRAM</span>
        <span>SECTION</span>
        <span>AVG GRADE</span>
        <span>STATUS</span>
      </div>
      <div className="table-body">
        {rows.length ? (
          rows.map((student, index) => (
            <div
              className="table-row"
              key={`${student.name}-${student.program}-${student.section}-${student.year}-${index}`}
            >
              <span>{student.name}</span>
              <span>{student.year}</span>
              <span>{student.gender}</span>
              <span>{student.program}</span>
              <span>{student.section}</span>
              <span>{student.avgGrade ?? '-'}</span>
              <span>{student.status}</span>
            </div>
          ))
        ) : (
          <div className="table-row empty-row">{message}</div>
        )}
      </div>
    </section>
  )
}

export default StudentsTable
