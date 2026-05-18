using Microsoft.AspNetCore.Mvc;
using StudentEnrollmentApi.Models;
using StudentEnrollmentApi.Services;

namespace StudentEnrollmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectionsController(SectionsService service) : ControllerBase
    {
        private readonly SectionsService _service = service;

        [HttpGet]
        public ActionResult<IEnumerable<Section>> GetAll()
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
    }
}
