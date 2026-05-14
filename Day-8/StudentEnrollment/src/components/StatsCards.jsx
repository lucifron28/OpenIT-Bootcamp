export const StatsCards = ({ stats }) => {
    return (
        <section className="stats-grid">
            {stats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                </div>
            ))}
        </section>
    );
};
