import { useEffect, useState } from "react";

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const genderOptions = ["Female", "Male", "Other"];
const programOptions = ["BSIT", "BSCS", "BSIS", "BSEMC"];
const statusOptions = ["Enrolled", "Pending"];

export const StudentForm = ({ isOpen, mode, initialValues, onSubmit, onCancel, onDelete }) => {
    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        if (isOpen) {
            setFormValues(initialValues);
        }
    }, [initialValues, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formValues);
    };

    return (
        <section className="form-card">
            <div className="form-header">
                <h2>{mode === "edit" ? "Edit Student" : "Add Student"}</h2>
                <p>Fill in the details to keep the roster updated.</p>
            </div>
            <form className="student-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <label className="form-field">
                        <span>Name</span>
                        <input
                            type="text"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                        />
                    </label>
                    <label className="form-field">
                        <span>Year</span>
                        <select name="year" value={formValues.year} onChange={handleChange} required>
                            {yearOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field">
                        <span>Gender</span>
                        <select name="gender" value={formValues.gender} onChange={handleChange} required>
                            {genderOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field">
                        <span>Program</span>
                        <select name="program" value={formValues.program} onChange={handleChange} required>
                            {programOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field">
                        <span>Section</span>
                        <input
                            type="text"
                            name="section"
                            value={formValues.section}
                            onChange={handleChange}
                            placeholder="Section"
                            required
                        />
                    </label>
                    <label className="form-field">
                        <span>Avg Grade</span>
                        <input
                            type="number"
                            name="avgGrade"
                            value={formValues.avgGrade}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            step="0.01"
                            required
                        />
                    </label>
                    <label className="form-field">
                        <span>Status</span>
                        <select name="status" value={formValues.status} onChange={handleChange} required>
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="form-actions">
                    <button className="btn btn-ghost" type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    {mode === "edit" ? (
                        <button className="btn btn-danger" type="button" onClick={onDelete}>
                            Delete
                        </button>
                    ) : null}
                    <button className="btn btn-primary" type="submit">
                        {mode === "edit" ? "Update Student" : "Save Student"}
                    </button>
                </div>
            </form>
        </section>
    );
};
