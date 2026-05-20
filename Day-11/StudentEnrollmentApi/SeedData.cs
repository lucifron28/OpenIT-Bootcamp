using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi;

public static class SeedData
{
    public static void EnsureSeeded(EnrollmentContext db)
    {
        db.Database.EnsureCreated();

        var programs = new[]
        {
            "Computer Science",
            "Information Technology",
            "Business Administration",
            "Engineering"
        };

        foreach (var programName in programs)
        {
            if (!db.Programs.Any(p => p.Name == programName))
            {
                db.Programs.Add(new Programs { Name = programName });
            }
        }

        db.SaveChanges();

        var programMap = db.Programs
            .Where(p => !string.IsNullOrWhiteSpace(p.Name))
            .GroupBy(p => p.Name)
            .ToDictionary(g => g.Key, g => g.First());

        var sections = new[]
        {
            new { Code = "CS101", Year = 2, Program = "Computer Science" },
            new { Code = "IT102", Year = 1, Program = "Information Technology" },
            new { Code = "BA201", Year = 3, Program = "Business Administration" },
            new { Code = "EN301", Year = 4, Program = "Engineering" }
        };

        foreach (var section in sections)
        {
            if (!programMap.TryGetValue(section.Program, out var program))
            {
                continue;
            }

            var programId = program.Id;
            var exists = db.Section.Any(s => s.ProgramId == programId && s.Code == section.Code);
            if (!exists)
            {
                db.Section.Add(new Section
                {
                    Code = section.Code,
                    Year = section.Year,
                    ProgramId = programId
                });
            }
        }

        db.SaveChanges();

        var students = new[]
        {
            new { First = "Ron Vincent", Last = "Cada", Year = 2, Gender = "M" },
            new { First = "Mike Andrei", Last = "Gomez", Year = 1, Gender = "M" },
            new { First = "Roosc", Last = "Zano", Year = 3, Gender = "M" },
            new { First = "Kurt", Last = "Laja", Year = 4, Gender = "M" }
        };

        foreach (var student in students)
        {
            var exists = db.Student.Any(s => s.FirstName == student.First && s.LastName == student.Last);
            if (!exists)
            {
                db.Student.Add(new Student
                {
                    FirstName = student.First,
                    LastName = student.Last,
                    Year = student.Year,
                    Gender = student.Gender,
                    IsEnrolled = true
                });
            }
        }

        db.SaveChanges();

        var sectionMap = db.Section
            .Where(s => !string.IsNullOrWhiteSpace(s.Code))
            .GroupBy(s => s.Code)
            .ToDictionary(g => g.Key, g => g.First());
        var studentMap = db.Student
            .AsEnumerable()
            .GroupBy(s => $"{s.FirstName} {s.LastName}".Trim())
            .ToDictionary(g => g.Key, g => g.First());

        var enrollments = new[]
        {
            new { Student = "Ron Vincent Cada", Section = "CS101" },
            new { Student = "Mike Andrei Gomez", Section = "IT102" },
            new { Student = "Roosc Zano", Section = "BA201" },
            new { Student = "Kurt Laja", Section = "EN301" }
        };

        foreach (var enrollment in enrollments)
        {
            if (!studentMap.TryGetValue(enrollment.Student, out var student))
            {
                continue;
            }

            if (!sectionMap.TryGetValue(enrollment.Section, out var section))
            {
                continue;
            }

            var studentId = student.StudentId;
            var sectionId = section.Id;
            var exists = db.StudentSection.Any(ss => ss.StudentId == studentId && ss.SectionId == sectionId);
            if (!exists)
            {
                db.StudentSection.Add(new StudentSection
                {
                    StudentId = studentId,
                    SectionId = sectionId
                });
            }
        }

        db.SaveChanges();

        var grades = new[]
        {
            new { Student = "Ron Vincent Cada", Grade = 89 },
            new { Student = "Mike Andrei Gomez", Grade = 92 },
            new { Student = "Roosc Zano", Grade = 85 },
            new { Student = "Kurt Laja", Grade = 88 }
        };

        foreach (var grade in grades)
        {
            if (!studentMap.TryGetValue(grade.Student, out var student))
            {
                continue;
            }

            var studentId = student.StudentId;
            var exists = db.StudentGrades.Any(g => g.StudentId == studentId);
            if (!exists)
            {
                db.StudentGrades.Add(new StudentGrades
                {
                    StudentId = studentId,
                    Grade = grade.Grade
                });
            }
        }

        db.SaveChanges();
    }
}
