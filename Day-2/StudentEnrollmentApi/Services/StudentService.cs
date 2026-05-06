using System;
using System.Collections.Generic;
using System.Linq;
using StudentEnrollmentApi.DTOs;
using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi.Services;

public class StudentService : IStudentService
{
    private static readonly List<string> OldSchools =
    [
        "Hidden Leaf Academy",
        "Enverga University",
        "MSEMSAT",
        "STI College",
    ];

    private static readonly List<string> Departments =
    [
        "CCMS",
        "CENG",
        "CBA",
        "CCJC"
    ];

    private static readonly List<Student> Students =
    [
        new Student
        {
            Id = 1,
            FirstName = "Ron",
            LastName = "Cada",
            Gender = "Male",
            Year = 2,
            OldSchool = OldSchools[0],
            EnrolledStatus = "Enrolled",
            Department = Departments[0],
            Address = "Lucena City"
        },
        new Student
        {
            Id = 2,
            FirstName = "Mike Andrei",
            LastName = "Gomez",
            Gender = "Male",
            Year = 3,
            OldSchool = OldSchools[1],
            EnrolledStatus = "Enrolled",
            Department = Departments[1],
            Address = "Lucena"
        },
        new Student
        {
            Id = 3,
            FirstName = "Kurt",
            LastName = "Laja",
            Gender = "Male",
            Year = 1,
            OldSchool = OldSchools[2],
            EnrolledStatus = "Enrolled",
            Department = Departments[2],
            Address = "Mauban"
        },
        new Student
        {
            Id = 4,
            FirstName = "Roosc",
            LastName = "Zano",
            Gender = "Male",
            Year = 2,
            OldSchool = OldSchools[3],
            EnrolledStatus = "Enrolled",
            Department = Departments[3],
            Address = "Lucena City"
        },
        new Student
        {
            Id = 5,
            FirstName = "Mika Andrea",
            LastName = "Gomez",
            Gender = "Female",
            Year = 2,
            OldSchool = OldSchools[0],
            EnrolledStatus = "Enrolled",
            Department = Departments[0],
            Address = "Lucena City"
        }
    ];

    private static int _nextId = 6;

    public IEnumerable<StudentResponseDto> GetAll(
        string? gender = null,
        string? department = null,
        int? year = null,
        string? oldSchool = null,
        string? enrolledStatus = null,
        string? name = null
    )
    {
        IEnumerable<Student> query = Students;

        if (!string.IsNullOrWhiteSpace(gender))
        {
            query = query.Where(s => s.Gender.Equals(gender, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(department))
        {
            query = query.Where(s => s.Department.Equals(department, StringComparison.OrdinalIgnoreCase));
        }

        if (year.HasValue)
        {
            query = query.Where(s => s.Year == year.Value);
        }

        if (!string.IsNullOrWhiteSpace(oldSchool))
        {
            query = query.Where(s => s.OldSchool.Equals(oldSchool, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(enrolledStatus))
        {
            query = query.Where(s => s.EnrolledStatus.Equals(enrolledStatus, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            query = query.Where(s =>
                (s.FirstName != null && s.FirstName.IndexOf(name, StringComparison.OrdinalIgnoreCase) >= 0) ||
                (s.LastName != null && s.LastName.IndexOf(name, StringComparison.OrdinalIgnoreCase) >= 0)
            );
        }

        return query.Select(Map);
    }

    public StudentResponseDto? GetById(int id)
    {
        var student = Students.FirstOrDefault(s => s.Id == id);
        return student is null ? null : Map(student);
    }

    public StudentResponseDto Create(StudentCreateDto dto)
    {
        var student = new Student
        {
            Id = _nextId++,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Gender = dto.Gender,
            Year = dto.Year,
            OldSchool = dto.OldSchool,
            EnrolledStatus = dto.EnrolledStatus,
            Department = dto.Department,
            Address = dto.Address,
        };

        Students.Add(student);
        return Map(student);
    }

    public bool Update(int id, StudentCreateDto dto)
    {
        var student = Students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.Gender = dto.Gender;
        student.Year = dto.Year;
        student.OldSchool = dto.OldSchool;
        student.EnrolledStatus = dto.EnrolledStatus;
        student.Department = dto.Department;
        student.Address = dto.Address;

        return true;
    }

    public bool Patch(int id, StudentPatchDto dto)
    {
        if (!dto.HasAnyChanges)
        {
            return false;
        }

        var student = Students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        if (dto.FirstName is not null)
        {
            student.FirstName = dto.FirstName;
        }

        if (dto.LastName is not null)
        {
            student.LastName = dto.LastName;
        }

        if (dto.Gender is not null)
        {
            student.Gender = dto.Gender;
        }

        if (dto.Year.HasValue)
        {
            student.Year = dto.Year.Value;
        }

        if (dto.OldSchool is not null)
        {
            student.OldSchool = dto.OldSchool;
        }

        if (dto.EnrolledStatus is not null)
        {
            student.EnrolledStatus = dto.EnrolledStatus;
        }

        if (dto.Department is not null)
        {
            student.Department = dto.Department;
        }

        if (dto.Address is not null)
        {
            student.Address = dto.Address;
        }

        return true;
    }

    public bool Delete(int id)
    {
        var student = Students.FirstOrDefault(s => s.Id == id);
        if (student is null)
        {
            return false;
        }

        Students.Remove(student);
        return true;
    }

    public object GetStats()
    {
        var byDepartment = Students
            .GroupBy(s => s.Department)
            .Select(g => new { Department = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        var byGender = Students
            .GroupBy(s => s.Gender)
            .Select(g => new { Gender = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToList();

        return new
        {
            TotalStudents = Students.Count,
            ByDepartment = byDepartment,
            GenderDivision = byGender
        };
    }

    public IEnumerable<string> GetOldSchools()
    {
        return OldSchools;
    }

    private static StudentResponseDto Map(Student student)
    {
        return new StudentResponseDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Gender = student.Gender,
            Year = student.Year,
            OldSchool = student.OldSchool,
            EnrolledStatus = student.EnrolledStatus,
            Department = student.Department,
            Address = student.Address,
        };
    }
}
