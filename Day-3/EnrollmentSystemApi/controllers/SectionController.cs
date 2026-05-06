using EnrollmentSystemApi.DTOs.Sections;
using EnrollmentSystemApi.DTOs.Students;
using EnrollmentSystemApi.Services.Sections;
using EnrollmentSystemApi.Services.Students;
using Microsoft.AspNetCore.Mvc;

namespace EnrollmentSystemApi.controllers;

[ApiController]
[Route("api/sections")]
public class SectionController(ISectionService sectionService, IStudentService studentService) : ControllerBase
{
	[HttpGet]
	public ActionResult<List<SectionResponseDTO>> GetAll()
	{
		return Ok(sectionService.GetAllSections());
	}

	[HttpGet("{id:int}")]
	public ActionResult<SectionResponseDTO> GetById(int id)
	{
		var section = sectionService.GetSectionById(id);
		if (section is null)
		{
			return NotFound();
		}

		return Ok(section);
	}

	[HttpGet("{sectionCode}/students/{studentId:int}")]
	public ActionResult<StudentResponseDTO> GetStudentBySectionAndId(string sectionCode, int studentId)
	{
		var student = studentService.GetStudentBySectionCodeAndId(sectionCode, studentId);
		if (student is null)
		{
			return NotFound();
		}

		return Ok(student);
	}

	[HttpGet("{sectionCode}/students")]
	public ActionResult<List<StudentResponseDTO>> GetStudentsBySectionCode(string sectionCode)
	{
		var students = studentService.GetStudentsBySectionCode(sectionCode);
		if (students is null)
		{
			return NotFound();
		}

		return Ok(students);
	}

	[HttpPost]
	public ActionResult<SectionResponseDTO> Create([FromBody] SectionCreateDTO sectionCreateDTO)
	{
		var createdSection = sectionService.Create(sectionCreateDTO);
		return CreatedAtAction(nameof(GetById), new { id = createdSection.Id }, createdSection);
	}

	[HttpPut("{id:int}")]
	public IActionResult Update(int id, [FromBody] SectionUpdateDTO sectionUpdateDTO)
	{
		var updated = sectionService.Update(id, sectionUpdateDTO);
		return updated ? NoContent() : NotFound();
	}

	[HttpPatch("{id:int}")]
	public IActionResult Patch(int id, [FromBody] SectionPatchDTO sectionPatchDTO)
	{
		var patched = sectionService.Patch(id, sectionPatchDTO);
		return patched ? NoContent() : NotFound();
	}

	[HttpDelete("{id:int}")]
	public IActionResult Delete(int id)
	{
		var deleted = sectionService.Delete(id);
		return deleted ? NoContent() : NotFound();
	}
}

