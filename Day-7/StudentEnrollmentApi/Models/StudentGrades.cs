using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentEnrollmentApi.Models;

public class StudentGrades
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int StudentId { get; set;}
    [Required]
    public int Grade { get; set; }
    public Student Students { get; set; } = new();
}
