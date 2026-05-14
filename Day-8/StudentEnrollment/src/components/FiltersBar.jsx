export const FiltersBar = ({
    search,
    program,
    year,
    programOptions,
    yearOptions,
    onSearchChange,
    onProgramChange,
    onYearChange,
    onAddStudent,
}) => {
    return (
        <section className="filters-bar">
            <div className="filters">
                <div className="field field--search">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search by name..."
                    />
                </div>
                <div className="field">
                    <select
                        value={program}
                        onChange={(event) => onProgramChange(event.target.value)}
                    >
                        {programOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <select
                        value={year}
                        onChange={(event) => onYearChange(event.target.value)}
                    >
                        {yearOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="filters-actions">
                <button className="btn btn-primary" type="button" onClick={onAddStudent}>
                    Add Student
                </button>
            </div>
        </section>
    );
};
