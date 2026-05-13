namespace StudentEnrollmentApi.Models;

public class StudentRow
{
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public int? AvgGrade { get; set; }
    public string Status { get; set; } = string.Empty;
}
