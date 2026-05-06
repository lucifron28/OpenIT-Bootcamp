using System.ComponentModel.DataAnnotations;

namespace StudentEnrollmentApi.DTOs;

public class StudentCreateDto
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Gender { get; set; } = string.Empty;

    [Range(1, 10)]
    public int Year { get; set; }

    [Required]
    [StringLength(100)]
    public string OldSchool { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string EnrolledStatus { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Address { get; set; } = string.Empty;
}
