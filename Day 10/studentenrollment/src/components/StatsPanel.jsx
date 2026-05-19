function StatsPanel({ stats }) {
  const safeStats = stats ?? {
    total: 0,
    enrolled: 0,
    programs: 0,
    avgGrade: '-',
  }

  const items = [
    {
      label: 'TOTAL STUDENTS',
      value: safeStats.total,
      tooltip: `Total students: ${safeStats.total}`,
    },
    {
      label: 'ENROLLED',
      value: safeStats.enrolled,
      tooltip: `Enrolled: ${safeStats.enrolled}`,
    },
    {
      label: 'PROGRAMS',
      value: safeStats.programs,
      tooltip: `Programs: ${safeStats.programs}`,
    },
    {
      label: 'AVG GRADE',
      value: safeStats.avgGrade,
      tooltip: `Avg grade: ${safeStats.avgGrade}`,
    },
  ]

  return (
    <section className="stats">
      {items.map((item) => (
        <div className="stat" key={item.label}>
          <span
            className="stat-bar"
            title={item.tooltip}
            aria-label={item.tooltip}
          />
          <strong className="stat-value">{item.value}</strong>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </section>
  )
}

export default StatsPanel
