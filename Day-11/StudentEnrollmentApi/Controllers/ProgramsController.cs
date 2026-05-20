using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEnrollmentApi.Models;
using StudentEnrollmentApi.Services;

namespace StudentEnrollmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramsController(ProgramsService service) : ControllerBase
    {
        private readonly ProgramsService _service = service;

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IEnumerable<Programs>> GetAll()
        {
            try
            {
                return Ok(_service.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public ActionResult<Programs> GetById(int id)
        {
            try
            {
                return Ok(_service.GetById(id));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public ActionResult<Programs> Create(Programs program)
        {
            try
            {
                var createdProgram = _service.Create(program);
                return CreatedAtAction(nameof(GetById), new { id = createdProgram.Id }, createdProgram);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, Programs program)
        {
            try
            {
                _service.Update(id, program);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _service.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("{programId:int}/sections")]
        public ActionResult<IEnumerable<Section>> GetSectionsByProgram(int programId)
        {
            try
            {
                return Ok(_service.GetSectionsByProgram(programId));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("{programId:int}/sections/{sectionCode}")]
        public ActionResult<Section> GetSectionByCode(int programId, string sectionCode)
        {
            try
            {
                return Ok(_service.GetSectionByCode(programId, sectionCode));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("{programId:int}/sections")]
        public ActionResult<Section> CreateSection(int programId, Section section)
        {
            try
            {
                var createdSection = _service.CreateSection(programId, section);
                return CreatedAtAction(nameof(GetSectionByCode), new { programId, sectionCode = createdSection.Code }, createdSection);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{programId:int}/sections/{sectionCode}")]
        public IActionResult UpdateSection(int programId, string sectionCode, Section section)
        {
            try
            {
                _service.UpdateSection(programId, sectionCode, section);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{programId:int}/sections/{sectionCode}")]
        public IActionResult DeleteSection(int programId, string sectionCode)
        {
            try
            {
                _service.DeleteSection(programId, sectionCode);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("{programId:int}/sections/{sectionCode}/student/{studentId:int}")]
        public ActionResult<IEnumerable<Student>> GetStudentByProgramSectionAndStudent(int programId, string sectionCode, int studentId)
        {
            try
            {
                return Ok(_service.GetStudentByProgramSectionAndStudent(programId, sectionCode, studentId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
