using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi.Services
{
    public class ProgramsService(EnrollmentContext context)
    {
        private readonly EnrollmentContext _context = context;

        public List<Programs> GetAll() => _context.Programs.ToList();

        public List<StudentRow> GetStudentRows()
        {
            return (from student in _context.Student
                    join studentSection in _context.StudentSection
                        on student.StudentId equals studentSection.StudentId into studentSections
                    from studentSection in studentSections.DefaultIfEmpty()
                    join section in _context.Section
                        on studentSection.SectionId equals section.Id into sections
                    from section in sections.DefaultIfEmpty()
                    join program in _context.Programs
                        on section.ProgramId equals program.Id into programs
                    from program in programs.DefaultIfEmpty()
                    join grade in _context.StudentGrades
                        on student.StudentId equals grade.StudentId into grades
                    from grade in grades.DefaultIfEmpty()
                    select new StudentRow
                    {
                        Name = student.FirstName + " " + student.LastName,
                        Year = student.Year,
                        Gender = student.Gender,
                        Program = program != null ? program.Name : string.Empty,
                        Section = section != null ? section.Code : string.Empty,
                        AvgGrade = grade != null ? grade.Grade : null,
                        Status = student.IsEnrolled ? "Enrolled" : "Not Enrolled"
                    }).ToList();
        }

        public Programs GetById(int id)
        {
            var program = _context.Programs.Find(id);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {id} not found");
            return program;
        }

        public Programs Create(Programs program)
        {
            _context.Programs.Add(program);
            _context.SaveChanges();
            return program;
        }

        public void Update(int id, Programs program)
        {
            var existing = _context.Programs.Find(id);
            if (existing == null)
                throw new KeyNotFoundException($"Program with id {id} not found");
            
            existing.Name = program.Name;
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var program = _context.Programs.Find(id);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {id} not found");
            
            _context.Programs.Remove(program);
            _context.SaveChanges();
        }

        public List<Section> GetSectionsByProgram(int programId)
        {
            var program = _context.Programs.Find(programId);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {programId} not found");

            var sections = _context.Section.Where(s => s.ProgramId == programId).ToList();
            if (!sections.Any())
                throw new KeyNotFoundException($"No sections found for program {programId}");
            return sections;
        }

        public Section CreateSection(int programId, Section section)
        {
            var program = _context.Programs.Find(programId);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {programId} not found");

            section.ProgramId = programId;
            _context.Section.Add(section);
            _context.SaveChanges();
            return section;
        }

        public void UpdateSection(int programId, string sectionCode, Section section)
        {
            var program = _context.Programs.Find(programId);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {programId} not found");

            var existing = _context.Section.FirstOrDefault(s => s.ProgramId == programId && s.Code == sectionCode);
            if (existing == null)
                throw new KeyNotFoundException($"Section {sectionCode} not found in program {programId}");

            existing.Code = section.Code;
            existing.Year = section.Year;
            _context.SaveChanges();
        }

        public void DeleteSection(int programId, string sectionCode)
        {
            var program = _context.Programs.Find(programId);
            if (program == null)
                throw new KeyNotFoundException($"Program with id {programId} not found");

            var section = _context.Section.FirstOrDefault(s => s.ProgramId == programId && s.Code == sectionCode);
            if (section == null)
                throw new KeyNotFoundException($"Section {sectionCode} not found in program {programId}");

            _context.Section.Remove(section);
            _context.SaveChanges();
        }

        public List<Student> GetStudentByProgramSectionAndStudent(int programId, string sectionCode, int studentId)
        {
            var program = _context.Programs.Find(programId);
            if (program == null)
                return new List<Student>();

            var section = _context.Section.FirstOrDefault(s => s.ProgramId == programId && s.Code == sectionCode);
            if (section == null)
                return new List<Student>();

            var student = _context.StudentSection
                .Where(ss => ss.SectionId == section.Id && ss.StudentId == studentId)
                .Select(ss => ss.Students)
                .FirstOrDefault();

            if (student == null)
                return new List<Student>();

            return new List<Student> { student };
        }
    }
}
