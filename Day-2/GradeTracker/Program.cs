using System.Text;

class Student
{
    int id;
    string name;
    string course;
    List<double> grades;

    public string Course => course;

    public Student(int id, string name, string course)
    {
        this.id = id;
        this.name = name;
        this.course = course;
        grades = [];
    }

    public string getName() => name;
    public string getCourse() => course;

    public double GetAverage()
    {
        if (grades.Count == 0) return 0;
        double sum = 0;
        foreach (double i in grades)
        {
            sum += i;
        }
        return sum / grades.Count;
    }

    public bool isHonor()
    {
        return GetAverage() >= 87.0;
    }

    public void AddGrades(IEnumerable<double> newGrades)
    {
        grades.AddRange(newGrades);
    }

    public override string ToString()
    {
        return $"{name} ({course}) - Avg: {GetAverage():F2}";
    }
}


class MainClass
{
    static void Main()
    {
        List<Student> students =
        [
            new Student(1, "Mike", "BSCS"),
            new Student(2, "Kurt", "BSIT"),
            new Student(3, "Roosc", "BSIT"),
            new Student(4, "Ron", "BSIT"),
            new Student(5, "Neo", "BSCS"),
            new Student(6, "Naruto", "BSCS"),
            new Student(7, "Sasuke", "BSCS"),
        ];

        students[0].AddGrades([90, 85, 88]);
        students[1].AddGrades([80, 82, 78]);
        students[2].AddGrades([92, 95, 94]);
        students[3].AddGrades([85, 88, 90]);
        students[4].AddGrades([88, 92, 90]);
        students[5].AddGrades([95, 90, 92]);
        students[6].AddGrades([99, 99, 99]);
        Student highestAverageStudent = students[0];
        foreach (Student student in students)
        {
            if (student.GetAverage() > highestAverageStudent.GetAverage())
            {
                highestAverageStudent = student;
            }
        }
        
        var report = new StringBuilder();

        report.AppendLine("=== GradeTracker Report ===");
        report.AppendLine($"Top Student: {highestAverageStudent}");

        report.AppendLine();
        report.AppendLine("Honor Students:");
        var honorStudents = students.Where(s => s.isHonor()).OrderByDescending(s => s.GetAverage());
        foreach (Student student in honorStudents)
        {
            report.AppendLine($"- {student.getName()}");
        }

        report.AppendLine();
        report.AppendLine("Count of Students per Course:");
        var courseCounts = students.GroupBy(s => s.Course).Select(g => new { Course = g.Key, Count = g.Count() });
        foreach (var courseCount in courseCounts)
        {
            report.AppendLine($"- {courseCount.Course}: {courseCount.Count}");
        }

        report.AppendLine();
        report.AppendLine("Full Ranking of Students:");
        var rankedStudents = students.OrderByDescending(s => s.GetAverage());
        for (int i = 1; i <= rankedStudents.Count(); i++)
        {
            report.AppendLine($"{i}. {rankedStudents.ElementAt(i - 1)}");
        }

        report.AppendLine();
        report.AppendLine("Students Grouped by Course:");
        var groupedStudents = students.GroupBy(s => s.Course);
        foreach (var group in groupedStudents)
        {
            report.AppendLine($"Course: {group.Key}");
            foreach (var student in group)
            {
                report.AppendLine($"- {student.getName()}");
            }
        }

        report.AppendLine();
        report.AppendLine("Top 3 Students per Course:");
        var topStudentsPerCourse = students.GroupBy(s => s.Course)
                                            .Select(g => new { Course = g.Key, TopStudents = g.OrderByDescending(s => s.GetAverage()).Take(3) });
        foreach (var courseGroup in topStudentsPerCourse)
        {
            report.AppendLine($"Course: {courseGroup.Course}");
            foreach (var student in courseGroup.TopStudents)
            {
                report.AppendLine($"- {student.getName()} ({student.GetAverage():F2})");
            }
        }

        Console.WriteLine(report.ToString());
    }
}