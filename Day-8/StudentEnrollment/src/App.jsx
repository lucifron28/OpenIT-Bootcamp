import { useMemo, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { StatsCards } from "./components/StatsCards";
import { FiltersBar } from "./components/FiltersBar";
import { StudentForm } from "./components/StudentForm";
import { StudentTable } from "./components/StudentTable";
import { Footer } from "./components/Footer";

const initialStudents = [
  {
    id: "S-1001",
    name: "Ron Vincent Cada",
    year: "3rd Year",
    gender: "Male",
    program: "BSIT",
    section: "M003",
    avgGrade: 1.75,
    status: "Enrolled",
  },
  {
    id: "S-1002",
    name: "Mika Andrea Gomez",
    year: "2nd Year",
    gender: "Female",
    program: "BSCS",
    section: "M002",
    avgGrade: 2.00,
    status: "Enrolled",
  },
  {
    id: "S-1003",
    name: "Roosc Zano",
    year: "3rd Year",
    gender: "Female",
    program: "BSIS",
    section: "M005",
    avgGrade: 3.00,
    status: "Pending",
  },
  {
    id: "S-1004",
    name: "Neo Medrano",
    year: "4th Year",
    gender: "Male",
    program: "BSEMC",
    section: "M001",
    avgGrade: 2.35,
    status: "Enrolled",
  },
  {
    id: "S-1005",
    name: "Kurt Patrick Laja",
    year: "2nd Year",
    gender: "Male",
    program: "BSIT",
    section: "M005",
    avgGrade: 1.62,
    status: "Enrolled",
  },
];

const emptyStudent = {
  name: "",
  year: "1st Year",
  gender: "Female",
  program: "BSIT",
  section: "A",
  avgGrade: "1.75",
  status: "Enrolled",
};

const yearOptions = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

const buildProgramOptions = (students) => {
  const uniquePrograms = Array.from(new Set(students.map((student) => student.program)));
  uniquePrograms.sort();
  return ["All Programs", ...uniquePrograms];
};

const normalizeFormValues = (values) => {
  const parsedGrade = Number.parseFloat(values.avgGrade);

  return {
    ...values,
    name: values.name.trim(),
    section: values.section.trim(),
    avgGrade: Number.isNaN(parsedGrade) ? 0 : parsedGrade,
  };
};

const formatStudentForForm = (student) => ({
  ...student,
  avgGrade: student.avgGrade.toFixed(2),
});

const nextStudentId = (students) => {
  const maxId = students.reduce((accumulator, student) => {
    const numeric = Number.parseInt(String(student.id).replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) {
      return accumulator;
    }
    return Math.max(accumulator, numeric);
  }, 1000);

  return `S-${maxId + 1}`;
};

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("All Programs");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [activeStudentId, setActiveStudentId] = useState(null);

  const activeStudent = useMemo(
    () => students.find((student) => student.id === activeStudentId) || null,
    [students, activeStudentId]
  );

  const programOptions = useMemo(() => buildProgramOptions(students), [students]);

  const stats = useMemo(() => {
    const total = students.length;
    const enrolled = students.filter((student) => student.status === "Enrolled").length;
    const programs = new Set(students.map((student) => student.program)).size;
    const averageGrade = total
      ? (students.reduce((sum, student) => sum + student.avgGrade, 0) / total).toFixed(2)
      : "0.00";

    return [
      { label: "TOTAL STUDENTS", value: total },
      { label: "ENROLLED", value: enrolled },
      { label: "PROGRAMS", value: programs },
      { label: "AVG GRADE", value: averageGrade },
    ];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        normalizedSearch === "" || student.name.toLowerCase().includes(normalizedSearch);
      const matchesProgram =
        programFilter === "All Programs" || student.program === programFilter;
      const matchesYear = yearFilter === "All Years" || student.year === yearFilter;

      return matchesSearch && matchesProgram && matchesYear;
    });
  }, [students, search, programFilter, yearFilter]);

  const openCreateForm = () => {
    setFormMode("create");
    setActiveStudentId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (student) => {
    setFormMode("edit");
    setActiveStudentId(student.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (values) => {
    const normalized = normalizeFormValues(values);

    if (formMode === "create") {
      setStudents((prev) => [{ ...normalized, id: nextStudentId(prev) }, ...prev]);
    } else if (activeStudentId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === activeStudentId ? { ...normalized, id: student.id } : student
        )
      );
    }

    closeForm();
  };

  const handleDelete = () => {
    if (!activeStudentId) {
      return;
    }

    const shouldDelete = window.confirm("Delete this student record?");
    if (!shouldDelete) {
      return;
    }

    setStudents((prev) => prev.filter((student) => student.id !== activeStudentId));
    closeForm();
  };

  const formValues = formMode === "edit" && activeStudent
    ? formatStudentForForm(activeStudent)
    : { ...emptyStudent };

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="app-container">
          <StatsCards stats={stats} />
          <FiltersBar
            search={search}
            program={programFilter}
            year={yearFilter}
            programOptions={programOptions}
            yearOptions={yearOptions}
            onSearchChange={setSearch}
            onProgramChange={setProgramFilter}
            onYearChange={setYearFilter}
            onAddStudent={openCreateForm}
          />
          <StudentForm
            isOpen={isFormOpen}
            mode={formMode}
            initialValues={formValues}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            onDelete={handleDelete}
          />
          <StudentTable students={filteredStudents} onSelectStudent={openEditForm} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
