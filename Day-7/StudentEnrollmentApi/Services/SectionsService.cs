using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi.Services;

public class SectionsService(EnrollmentContext context)
{
    private readonly EnrollmentContext _context = context;

    public List<Section> GetAll()
    {
        return _context.Section.ToList();
    }
}
