using EnrollmentSystemApi.DTOs.Students;
using EnrollmentSystemApi.models;
using EnrollmentSystemApi.Services.Sections;

namespace EnrollmentSystemApi.Services.Students;

public class StudentService : IStudentService
{
    private readonly ISectionService _sectionService;
    private readonly List<Student> _students =
    [
        new Student
        {
            Id = 1,
            FirstName = "Ron",
            LastName = "Cada",
            Age = 20,
            Gender = "Male",
            SectionId = 1
        }
    ];

    public StudentService(ISectionService sectionService)
    {
        _sectionService = sectionService;
    }

    public List<StudentResponseDTO> GetAllStudents()
    {
        return [.. _students.Select(MapToResponse)];
    }

    public StudentResponseDTO? GetStudentById(int id)
    {
        var student = _students.FirstOrDefault(s => s.Id == id);
        return student is null ? null : MapToResponse(student);
    }

    public List<StudentResponseDTO>? GetStudentsBySectionCode(string sectionCode)
    {
        var section = _sectionService.GetSectionByCode(sectionCode);
        if (section is null)
        {
            return null;
        }

        return [.. _students
            .Where(student => student.SectionId == section.Id)
            .Select(MapToResponse)];
    }

    public StudentResponseDTO? GetStudentBySectionCodeAndId(string sectionCode, int studentId)
    {
        var section = _sectionService.GetSectionByCode(sectionCode);
        if (section is null)
        {
            return null;
        }

        var student = _students.FirstOrDefault(s => s.SectionId == section.Id && s.Id == studentId);
        return student is null ? null : MapToResponse(student);
    }

    public List<StudentResponseDTO> SearchStudents(string? firstName, string? lastName, string? gender, int? age)
    {
        var result = _students.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(firstName))
        {
            result = result.Where(s => s.FirstName.Contains(firstName, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(lastName))
        {
            result = result.Where(s => s.LastName.Contains(lastName, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            result = result.Where(s => string.Equals(s.Gender, gender, StringComparison.OrdinalIgnoreCase));
        }

        if (age.HasValue)
        {
            result = result.Where(s => s.Age == age.Value);
        }

        return [.. result.Select(MapToResponse)];
    }

    public StudentResponseDTO Create(StudentCreateDTO studentCreateDTO)
    {
        var nextId = _students.Count == 0 ? 1 : _students.Max(s => s.Id) + 1;
        var newStudent = new Student
        {
            Id = nextId,
            FirstName = studentCreateDTO.FirstName,
            LastName = studentCreateDTO.LastName,
            Age = studentCreateDTO.Age,
            Gender = studentCreateDTO.Gender,
            SectionId = studentCreateDTO.SectionId
        };

        _students.Add(newStudent);
        return MapToResponse(newStudent);
    }

    public bool Update(int id, StudentUpdateDTO studentUpdateDTO)
    {
        var student = _students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        student.FirstName = studentUpdateDTO.FirstName;
        student.LastName = studentUpdateDTO.LastName;
        student.Age = studentUpdateDTO.Age;
        student.Gender = studentUpdateDTO.Gender;
        student.SectionId = studentUpdateDTO.SectionId;
        return true;
    }

    public bool Patch(int id, StudentPatchDTO studentPatchDTO)
    {
        var student = _students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(studentPatchDTO.FirstName))
        {
            student.FirstName = studentPatchDTO.FirstName;
        }

        if (!string.IsNullOrWhiteSpace(studentPatchDTO.LastName))
        {
            student.LastName = studentPatchDTO.LastName;
        }

        if (studentPatchDTO.Age.HasValue)
        {
            student.Age = studentPatchDTO.Age.Value;
        }

        if (!string.IsNullOrWhiteSpace(studentPatchDTO.Gender))
        {
            student.Gender = studentPatchDTO.Gender;
        }

        if (studentPatchDTO.SectionId.HasValue)
        {
            student.SectionId = studentPatchDTO.SectionId.Value;
        }

        return true;
    }

    public bool Delete(int id)
    {
        var student = _students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        _students.Remove(student);
        return true;
    }

    private StudentResponseDTO MapToResponse(Student student)
    {
        var sectionCode = _sectionService.GetSectionById(student.SectionId)?.Code ?? string.Empty;

        return new StudentResponseDTO
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Age = student.Age,
            Gender = student.Gender,
            SectionCode = sectionCode
        };
    }
}