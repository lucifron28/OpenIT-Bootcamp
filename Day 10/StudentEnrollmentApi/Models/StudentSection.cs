using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentEnrollmentApi.Models;

public class StudentSection
{
    [Key]
    [Required]
    public int Id { get; set; }
    [Required]
    public int StudentId { get; set; }
    [Required]
    public int SectionId { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public Student? Students { get; set; }
    public Section? Sections { get; set; }
}
