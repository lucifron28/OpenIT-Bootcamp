using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentEnrollmentApi.Models;

public class Section
{
    [Key]
    [Required]
    public int Id { get; set; }
    [Required]
    public string Code { get; set; } = string.Empty;
    [Required]
    public int Year { get; set; }
    [Required]
    public int ProgramId { get; set; }
    public Programs Programs { get; set; } = new();
}
