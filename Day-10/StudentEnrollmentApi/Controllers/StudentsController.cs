using Microsoft.AspNetCore.Mvc;
using StudentEnrollmentApi.Models;
using StudentEnrollmentApi.Services;

namespace StudentEnrollmentApi.Controllers
{
    public class StudentSectionRequest
    {
        public int SectionId { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController(StudentsService service) : ControllerBase
    {
        private readonly StudentsService _service = service;

        [HttpGet]
        public ActionResult<IEnumerable<StudentRow>> GetAll()
        {
            try
            {
                return Ok(_service.GetStudentRows());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult<Student> GetById(int id)
        {
            try
            {
                var student = _service.GetById(id);
                if (student == null)
                {
                    return NotFound();
                }
                return Ok(student);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public ActionResult<Student> Create(Student student)
        {
            try
            {
                var createdStudent = _service.Create(student);
                return CreatedAtAction(nameof(GetById), new { id = createdStudent.StudentId }, createdStudent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, Student student)
        {
            try
            {
                _service.Update(id, student);
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

        [HttpPut("{id:int}/section")]
        public IActionResult UpdateSection(int id, StudentSectionRequest request)
        {
            if (request == null || request.SectionId <= 0)
            {
                return BadRequest("SectionId is required.");
            }

            try
            {
                _service.AssignSection(id, request.SectionId);
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

        [HttpPut("{id:int}/section/{sectionId:int}")]
        public IActionResult UpdateSectionById(int id, int sectionId)
        {
            if (sectionId <= 0)
            {
                return BadRequest("SectionId is required.");
            }

            try
            {
                _service.AssignSection(id, sectionId);
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
    }
}
