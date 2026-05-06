namespace LibraryAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
	private readonly IBookService _bookService;

	public BookController(IBookService bookService)
	{
		_bookService = bookService;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetAll()
	{
		var books = await _bookService.GetAllBooksAsync();
		return Ok(books);
	}

	[HttpGet("{id:int}")]
	public async Task<ActionResult<BookResponseDto>> GetById(int id)
	{
		var book = await _bookService.GetBookByIdAsync(id);
		return book is null ? NotFound() : Ok(book);
	}

	[HttpGet("search")]
	public async Task<ActionResult<IEnumerable<BookResponseDto>>> Search([FromQuery] string? author, [FromQuery] int? yearPublished)
	{
		var books = await _bookService.SearchBooksAsync(author, yearPublished);
		return Ok(books);
	}

	[HttpPost]
	public async Task<ActionResult<BookResponseDto>> Create([FromBody] BookCreateDto dto)
	{
		var created = await _bookService.CreateBookAsync(dto);
		return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
	}

	[HttpPut("{id:int}")]
	public async Task<IActionResult> Update(int id, [FromBody] BookCreateDto dto)
	{
		var updated = await _bookService.UpdateBookAsync(id, dto);
		return updated ? NoContent() : NotFound();
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id)
	{
		var deleted = await _bookService.DeleteBookAsync(id);
		return deleted ? NoContent() : NotFound();
	}
}
