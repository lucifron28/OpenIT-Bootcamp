using System;
using  System.ComponentModel.DataAnnotations;

namespace StudentEnrollmentApi.Models;

public class Programs
{
    [Key]
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
}
