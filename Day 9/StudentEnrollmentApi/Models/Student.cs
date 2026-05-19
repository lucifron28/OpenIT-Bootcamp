using System;
using System.ComponentModel.DataAnnotations;

namespace StudentEnrollmentApi.Models;

public class Student
{
    [Key]
    public int StudentId { get; set; }
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public int Year { get; set; }
    [Required]
    [StringLength(10)]
    public string Gender { get; set; } = string.Empty;
    public bool IsEnrolled { get; set; } = true;
    public DateTime Created_at { get; set; } = DateTime.UtcNow;
}

