namespace StudentEnrollmentApi.DTOs;

public class StudentResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public int Year { get; set; }
    public string OldSchool { get; set; } = string.Empty;
    public string EnrolledStatus { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
