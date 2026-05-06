using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using StudentEnrollmentApi.DTOs;
using StudentEnrollmentApi.Services;

namespace StudentEnrollmentApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<StudentResponseDto>> GetAll(
        [FromQuery] string? gender,
        [FromQuery] string? department,
        [FromQuery] int? year,
        [FromQuery(Name = "oldSchool")] string? oldSchool,
        [FromQuery] string? enrolledStatus,
        [FromQuery] string? name
    )
    {
        var students = _studentService.GetAll(gender, department, year, oldSchool, enrolledStatus, name);
        return Ok(students);
    }

    [HttpGet("{id:int}")]
    public ActionResult<StudentResponseDto> GetById(int id)
    {
        var student = _studentService.GetById(id);
        return student is null ? NotFound() : Ok(student);
    }

    [HttpGet("search")]
    public ActionResult<IEnumerable<StudentResponseDto>> Search(
        [FromQuery] string? gender,
        [FromQuery] string? department,
        [FromQuery] int? year,
        [FromQuery(Name = "oldSchool")] string? oldSchool,
        [FromQuery] string? enrolledStatus,
        [FromQuery] string? name
    )
    {
        var students = _studentService.GetAll(gender, department, year, oldSchool, enrolledStatus, name);
        return Ok(students);
    }

    [HttpGet("stats")]
    public ActionResult<object> Stats()
    {
        return Ok(_studentService.GetStats());
    }

    [HttpGet("oldschools")]
    public ActionResult<IEnumerable<string>> OldSchools()
    {
        return Ok(_studentService.GetOldSchools());
    }

    [HttpPost]
    public ActionResult<StudentResponseDto> Create([FromBody] StudentCreateDto dto)
    {
        var created = _studentService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] StudentCreateDto dto)
    {
        var updated = _studentService.Update(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpPatch("{id:int}")]
    public IActionResult Patch(int id, [FromBody] StudentPatchDto dto)
    {
        if (!dto.HasAnyChanges)
        {
            return BadRequest("Provide at least one field to update.");
        }

        var updated = _studentService.Patch(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var deleted = _studentService.Delete(id);
        return deleted ? NoContent() : NotFound();
    }
}
