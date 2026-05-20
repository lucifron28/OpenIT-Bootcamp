function FiltersBar({
  searchText,
  onSearchChange,
  programFilter,
  onProgramChange,
  yearFilter,
  onYearChange,
  programOptions,
  yearOptions,
}) {
  return (
    <section className="filters">
      <div className="search">
        <span className="search-icon" aria-hidden="true">
          &#128269;
        </span>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="filter">
        <select
          value={programFilter}
          onChange={(event) => onProgramChange(event.target.value)}
        >
          <option value="">All Programs</option>
          {programOptions.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>
      <div className="filter">
        <select
          value={yearFilter}
          onChange={(event) => onYearChange(event.target.value)}
        >
          <option value="">All Years</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              Year {year}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}

export default FiltersBar
