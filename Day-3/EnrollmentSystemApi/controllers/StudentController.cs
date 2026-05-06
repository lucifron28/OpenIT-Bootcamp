using Microsoft.AspNetCore.Mvc;
using EnrollmentSystemApi.DTOs.Students;
using EnrollmentSystemApi.Services.Students;

namespace EnrollmentSystemApi.controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController(IStudentService studentService) : ControllerBase
{
	[HttpGet]
	public ActionResult<List<StudentResponseDTO>> GetAll(
		[FromQuery] string? firstName,
		[FromQuery] string? lastName,
		[FromQuery] string? gender,
		[FromQuery] int? age)
	{
		var hasSearchParams =
			!string.IsNullOrWhiteSpace(firstName) ||
			!string.IsNullOrWhiteSpace(lastName) ||
			!string.IsNullOrWhiteSpace(gender) ||
			age.HasValue;

		var students = hasSearchParams
			? studentService.SearchStudents(firstName, lastName, gender, age)
			: studentService.GetAllStudents();

		return Ok(students);
	}

	[HttpGet("{id:int}")]
	public ActionResult<StudentResponseDTO> GetById(int id)
	{
		var student = studentService.GetStudentById(id);
		if (student is null)
		{
			return NotFound();
		}

		return Ok(student);
	}

	[HttpPost]
	public ActionResult<StudentResponseDTO> Create([FromBody] StudentCreateDTO studentCreateDTO)
	{
		var createdStudent = studentService.Create(studentCreateDTO);
		return CreatedAtAction(nameof(GetById), new { id = createdStudent.Id }, createdStudent);
	}

	[HttpPut("{id:int}")]
	public IActionResult Update(int id, [FromBody] StudentUpdateDTO studentUpdateDTO)
	{
		var updated = studentService.Update(id, studentUpdateDTO);
		return updated ? NoContent() : NotFound();
	}

	[HttpPatch("{id:int}")]
	public IActionResult Patch(int id, [FromBody] StudentPatchDTO studentPatchDTO)
	{
		var patched = studentService.Patch(id, studentPatchDTO);
		return patched ? NoContent() : NotFound();
	}

	[HttpDelete("{id:int}")]
	public IActionResult Delete(int id)
	{
		var deleted = studentService.Delete(id);
		return deleted ? NoContent() : NotFound();
	}
}

