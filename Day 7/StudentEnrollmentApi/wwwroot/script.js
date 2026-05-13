const programFilter = document.getElementById("programFilter");
const yearFilter = document.getElementById("yearFilter");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const totalStudentsBar = document.getElementById("total-students");
const enrolledStudentsBar = document.getElementById("enrolled-students");
const totalProgramsBar = document.getElementById("total-programs");
const avgGradeBar = document.getElementById("avg-grade");

const API_BASE = window.location.origin.includes("5500")
	? "http://localhost:5001"
	: window.location.origin;
const STUDENTS_URL = `${API_BASE}/api/programs/students`;

let students = [];

function setEmptyRow(message) {
	tableBody.innerHTML = `<div class="table-row empty-row">${message}</div>`;
}

function setStatTooltip(element, label, value) {
	if (!element) {
		return;
	}
	const text = `${label}: ${value}`;
	element.setAttribute("title", text);
	element.setAttribute("aria-label", text);
}

function updateStats(rows) {
	const total = rows.length;
	const enrolled = rows.filter((student) => student.status.toLowerCase() === "enrolled").length;
	const programs = new Set(rows.map((student) => student.program).filter(Boolean)).size;
	const grades = rows
		.map((student) => student.avgGrade)
		.filter((grade) => typeof grade === "number");
	const avgGrade = grades.length
		? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
		: "-";

	setStatTooltip(totalStudentsBar, "Total students", total);
	setStatTooltip(enrolledStudentsBar, "Enrolled", enrolled);
	setStatTooltip(totalProgramsBar, "Programs", programs);
	setStatTooltip(avgGradeBar, "Avg grade", avgGrade);
}

function setProgramOptions(programs) {
	programFilter.innerHTML = "<option value=\"\">All Programs</option>";
	programs.forEach((program) => {
		const option = document.createElement("option");
		option.value = program;
		option.textContent = program;
		programFilter.appendChild(option);
	});
}

function setYearOptions(years) {
	yearFilter.innerHTML = "<option value=\"\">All Years</option>";
	years.forEach((year) => {
		const option = document.createElement("option");
		option.value = year;
		option.textContent = `Year ${year}`;
		yearFilter.appendChild(option);
	});
}

function renderRows(rows) {
	if (!rows.length) {
		setEmptyRow("No matching students.");
		return;
	}

	tableBody.innerHTML = "";
	rows.forEach((student) => {
		const row = document.createElement("div");
		row.className = "table-row";
		row.innerHTML = `
			<span>${student.name}</span>
			<span>${student.year}</span>
			<span>${student.gender}</span>
			<span>${student.program}</span>
			<span>${student.section}</span>
			<span>${student.avgGrade ?? "-"}</span>
			<span>${student.status}</span>
		`;
		tableBody.appendChild(row);
	});
}

function normalizeStudent(student) {
	return {
		name: student.name ?? student.Name ?? "",
		year: student.year ?? student.Year ?? "",
		gender: student.gender ?? student.Gender ?? "",
		program: student.program ?? student.Program ?? "",
		section: student.section ?? student.Section ?? "",
		avgGrade: student.avgGrade ?? student.AvgGrade ?? null,
		status: student.status ?? student.Status ?? ""
	};
}

function applyFilters() {
	const searchValue = searchInput.value.trim().toLowerCase();
	const programValue = programFilter.value;
	const yearValue = yearFilter.value;

	const filtered = students.filter((student) => {
		const matchesSearch = !searchValue || student.name.toLowerCase().includes(searchValue);
		const matchesProgram = !programValue || student.program === programValue;
		const matchesYear = !yearValue || student.year.toString() === yearValue;
		return matchesSearch && matchesProgram && matchesYear;
	});

	updateStats(filtered);
	renderRows(filtered);
}

function initFilters() {
	const programs = Array.from(new Set(students.map((student) => student.program).filter(Boolean))).sort();
	const years = Array.from(new Set(students.map((student) => student.year).filter(Boolean))).sort((a, b) => a - b);
	setProgramOptions(programs);
	setYearOptions(years);
}

async function loadStudents() {
	setEmptyRow("Loading students...");
	try {
		const response = await fetch(STUDENTS_URL);
		if (!response.ok) {
			throw new Error("Failed to load students");
		}
		const data = await response.json();
		students = data.map(normalizeStudent);
		if (!students.length) {
			updateStats([]);
			setEmptyRow("No students found.");
			return;
		}
		initFilters();
		applyFilters();
	} catch (error) {
		updateStats([]);
		setEmptyRow(error.message);
	}
}

programFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

loadStudents();
