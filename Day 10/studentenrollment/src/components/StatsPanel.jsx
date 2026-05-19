function StatsPanel({ stats }) {
  const items = [
    {
      label: 'TOTAL STUDENTS',
      value: stats.total,
      tooltip: `Total students: ${stats.total}`,
    },
    {
      label: 'ENROLLED',
      value: stats.enrolled,
      tooltip: `Enrolled: ${stats.enrolled}`,
    },
    {
      label: 'PROGRAMS',
      value: stats.programs,
      tooltip: `Programs: ${stats.programs}`,
    },
    {
      label: 'AVG GRADE',
      value: stats.avgGrade,
      tooltip: `Avg grade: ${stats.avgGrade}`,
    },
  ]

  return (
    <section className="stats">
      {items.map((item) => (
        <div className="stat" key={item.label}>
          {item.value ?  <strong className="stat-value">{item.value}</strong> : <span className="stat-bar" title={item.tooltip} aria-label={item.tooltip} />} 
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </section>
  )
}

export default StatsPanel
