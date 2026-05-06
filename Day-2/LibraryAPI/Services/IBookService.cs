using LibraryAPI.DTOs;

namespace LibraryAPI.Services;

public interface IBookService
{
	Task<IEnumerable<BookResponseDto>> GetAllBooksAsync();
	Task<BookResponseDto?> GetBookByIdAsync(int id);
	Task<IEnumerable<BookResponseDto>> SearchBooksAsync(string? author, int? yearPublished);
	Task<BookResponseDto> CreateBookAsync(BookCreateDto dto);
	Task<bool> UpdateBookAsync(int id, BookCreateDto dto);
	Task<bool> DeleteBookAsync(int id);
}
