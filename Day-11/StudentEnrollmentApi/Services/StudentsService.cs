using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi.Services;

public class StudentsService(EnrollmentContext context)
{
    private readonly EnrollmentContext _context = context;

    public List<StudentRow> GetStudentRows()
    {
        return [.. from student in _context.Student
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
                    StudentId = student.StudentId,
                    Name = student.FirstName + " " + student.LastName,
                    Year = student.Year,
                    Gender = student.Gender,
                    Program = program != null ? program.Name : string.Empty,
                    Section = section != null ? section.Code : string.Empty,
                    AvgGrade = grade != null ? grade.Grade : null,
                    Status = student.IsEnrolled ? "Enrolled" : "Not Enrolled"
                }];
    }

    public Student GetById(int id)
    {
        var student = _context.Student.Find(id) ?? throw new KeyNotFoundException($"Student with id {id} not found");
        return student;
    }

    public Student Create(Student student)
    {
        _context.Student.Add(student);
        _context.SaveChanges();
        return student;
    }

    public void Update(int id, Student student)
    {
        var existing = _context.Student.Find(id);
        if (existing == null)
            throw new KeyNotFoundException($"Student with id {id} not found");
        
        existing.FirstName = student.FirstName;
        existing.LastName = student.LastName;
        existing.Year = student.Year;
        existing.Gender = student.Gender;
        existing.IsEnrolled = student.IsEnrolled;   
        _context.SaveChanges();
    }

    public void AssignSection(int studentId, int sectionId)
    {
        var student = _context.Student.Find(studentId);
        if (student == null)
            throw new KeyNotFoundException($"Student with id {studentId} not found");

        var section = _context.Section.Find(sectionId);
        if (section == null)
            throw new KeyNotFoundException($"Section with id {sectionId} not found");

        var existing = _context.StudentSection.FirstOrDefault(ss => ss.StudentId == studentId);
        if (existing == null)
        {
            _context.StudentSection.Add(new StudentSection
            {
                StudentId = studentId,
                SectionId = sectionId
            });
        }
        else
        {
            existing.SectionId = sectionId;
        }

        _context.SaveChanges();
    }

    public void Delete (int id)
    {
        var student = _context.Student.Find(id) ?? throw new KeyNotFoundException($"Student with id {id} not found");
        _context.Student.Remove(student);
        _context.SaveChanges();
    }
}
