using System.ComponentModel.DataAnnotations;

class Student
{
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public int SectionId { get; set; }
}