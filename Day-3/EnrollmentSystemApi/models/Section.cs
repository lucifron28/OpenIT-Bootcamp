using System.ComponentModel.DataAnnotations;

class Section
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;
}