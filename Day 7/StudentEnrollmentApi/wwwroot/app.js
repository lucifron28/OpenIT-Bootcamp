const programSelect = document.getElementById("programSelect");
const statPrograms = document.getElementById("statPrograms");
const statSections = document.getElementById("statSections");
const statLookup = document.getElementById("statLookup");
const statusMessage = document.getElementById("statusMessage");
const heroProgram = document.getElementById("heroProgram");
const sectionsList = document.getElementById("sectionsList");
const sectionsEmpty = document.getElementById("sectionsEmpty");
const lookupForm = document.getElementById("lookupForm");
const lookupResult = document.getElementById("lookupResult");
const lookupEmpty = document.getElementById("lookupEmpty");

const PROGRAMS_URL = "/api/programs";

function setStatus(message) {
    statusMessage.textContent = message;
}

function clearSections() {
    sectionsList.innerHTML = "";
    sectionsEmpty.style.display = "block";
    statSections.textContent = "0";
}

function renderSections(sections) {
    sectionsList.innerHTML = "";
    if (!sections.length) {
        sectionsEmpty.style.display = "block";
        statSections.textContent = "0";
        return;
    }

    sectionsEmpty.style.display = "none";
    statSections.textContent = sections.length.toString();
    sections.forEach((section) => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.textContent = `${section.code || section.Code} - Year ${section.year || section.Year}`;
        sectionsList.appendChild(chip);
    });
}

function updateHeroProgram() {
    const selected = programSelect.options[programSelect.selectedIndex];
    if (!selected) {
        heroProgram.textContent = "No program selected";
        return;
    }
    heroProgram.textContent = selected.textContent;
}

async function loadPrograms() {
    setStatus("Loading programs...");
    programSelect.innerHTML = "";

    try {
        const response = await fetch(PROGRAMS_URL);
        if (!response.ok) {
            throw new Error("Unable to load programs");
        }
        const programs = await response.json();
        statPrograms.textContent = programs.length.toString();

        if (!programs.length) {
            programSelect.innerHTML = "<option value=\"\">No programs found</option>";
            updateHeroProgram();
            clearSections();
            setStatus("No programs found.");
            return;
        }

        programs.forEach((program) => {
            const option = document.createElement("option");
            option.value = program.id ?? program.Id;
            option.textContent = `${program.name || program.Name} (ID ${program.id ?? program.Id})`;
            programSelect.appendChild(option);
        });

        updateHeroProgram();
        setStatus("Programs loaded.");
        await loadSections();
    } catch (error) {
        setStatus(error.message);
    }
}

async function loadSections() {
    const programId = programSelect.value;
    if (!programId) {
        clearSections();
        return;
    }

    setStatus("Loading sections...");

    try {
        const response = await fetch(`${PROGRAMS_URL}/${programId}/sections`);
        if (response.status === 404) {
            renderSections([]);
            setStatus("No sections found for this program.");
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load sections");
        }

        const sections = await response.json();
        renderSections(sections);
        setStatus("Sections loaded.");
    } catch (error) {
        setStatus(error.message);
    }
}

function renderLookupResult(students) {
    if (!students.length) {
        lookupEmpty.style.display = "block";
        lookupResult.textContent = "";
        statLookup.textContent = "0";
        return;
    }

    const student = students[0];
    const createdAt = student.created_at || student.createdAt || student.Created_at || "-";

    lookupEmpty.style.display = "none";
    statLookup.textContent = students.length.toString();
    lookupResult.textContent = `Student ID: ${student.studentId ?? student.StudentId}\n` +
        `Name: ${student.firstName ?? student.FirstName} ${student.lastName ?? student.LastName}\n` +
        `Year: ${student.year ?? student.Year}\n` +
        `Gender: ${student.gender ?? student.Gender}\n` +
        `Enrolled: ${student.isEnrolled ?? student.IsEnrolled}\n` +
        `Created: ${createdAt}`;
}

async function lookupStudent(event) {
    event.preventDefault();

    const programId = programSelect.value;
    const sectionCode = document.getElementById("sectionCode").value.trim();
    const studentId = document.getElementById("studentId").value.trim();

    if (!programId || !sectionCode || !studentId) {
        setStatus("Select a program and fill out all fields.");
        return;
    }

    setStatus("Looking up student...");

    try {
        const response = await fetch(`${PROGRAMS_URL}/${programId}/sections/${encodeURIComponent(sectionCode)}/student/${studentId}`);
        if (!response.ok) {
            throw new Error("Lookup failed");
        }

        const students = await response.json();
        renderLookupResult(students);
        setStatus("Lookup complete.");
    } catch (error) {
        setStatus(error.message);
    }
}

programSelect.addEventListener("change", () => {
    updateHeroProgram();
    loadSections();
});

document.getElementById("refreshPrograms").addEventListener("click", loadPrograms);

document.getElementById("loadSections").addEventListener("click", loadSections);

lookupForm.addEventListener("submit", lookupStudent);

lookupEmpty.style.display = "block";
clearSections();
loadPrograms();
