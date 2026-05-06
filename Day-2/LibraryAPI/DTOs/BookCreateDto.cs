namespace LibraryAPI.DTOs;

public class BookCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int YearPublished { get; set; }
}
