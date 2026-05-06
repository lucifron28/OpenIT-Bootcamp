using LibraryAPI.DTOs;
using LibraryAPI.Models;

namespace LibraryAPI.Services;

public class BookService : IBookService
{
	private static readonly List<Book> Books =
	[
		new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", YearPublished = 1925 },
		new Book { Id = 2, Title = "1984", Author = "George Orwell", YearPublished = 1949 },
		new Book { Id = 3, Title = "To Kill a Mockingbird", Author = "Harper Lee", YearPublished = 1960 }
	];

	private static int _nextId = 4;

	public Task<IEnumerable<BookResponseDto>> GetAllBooksAsync()
	{
		return Task.FromResult(Books.Select(MapToResponse));
	}

	public Task<BookResponseDto?> GetBookByIdAsync(int id)
	{
		var book = Books.FirstOrDefault(b => b.Id == id);
		return Task.FromResult(book is null ? null : MapToResponse(book));
	}

	public Task<IEnumerable<BookResponseDto>> SearchBooksAsync(string? author, int? yearPublished)
	{
		IEnumerable<Book> query = Books;

		if (!string.IsNullOrWhiteSpace(author))
		{
			query = query.Where(b => b.Author.Contains(author, StringComparison.OrdinalIgnoreCase));
		}

		if (yearPublished.HasValue)
		{
			query = query.Where(b => b.YearPublished == yearPublished.Value);
		}

		return Task.FromResult(query.Select(MapToResponse));
	}

	public Task<BookResponseDto> CreateBookAsync(BookCreateDto dto)
	{
		var book = new Book
		{
			Id = _nextId++,
			Title = dto.Title,
			Author = dto.Author,
			YearPublished = dto.YearPublished
		};

		Books.Add(book);
		return Task.FromResult(MapToResponse(book));
	}

	public Task<bool> UpdateBookAsync(int id, BookCreateDto dto)
	{
		var existing = Books.FirstOrDefault(b => b.Id == id);
		if (existing is null)
		{
			return Task.FromResult(false);
		}

		existing.Title = dto.Title;
		existing.Author = dto.Author;
		existing.YearPublished = dto.YearPublished;

		return Task.FromResult(true);
	}

	public Task<bool> DeleteBookAsync(int id)
	{
		var existing = Books.FirstOrDefault(b => b.Id == id);
		if (existing is null)
		{
			return Task.FromResult(false);
		}

		Books.Remove(existing);
		return Task.FromResult(true);
	}

	private static BookResponseDto MapToResponse(Book book)
	{
		return new BookResponseDto
		{
			Id = book.Id,
			Title = book.Title,
			Author = book.Author,
			YearPublished = book.YearPublished
		};
	}
}
