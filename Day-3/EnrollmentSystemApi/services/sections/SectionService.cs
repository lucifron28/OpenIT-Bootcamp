using EnrollmentSystemApi.DTOs.Sections;
using EnrollmentSystemApi.models;

namespace EnrollmentSystemApi.Services.Sections;

public class SectionService : ISectionService
{
    private readonly List<Section> _sections =
    [
        new Section
        {
            Id = 1,
            Code = "M2022",
            Students =
            [
                new Student
                {
                    Id = 1,
                    FirstName = "Ron",
                    LastName = "Cada",
                    Age = 20,
                    Gender = "Male",
                    SectionId = 1
                }
            ]
        }
    ];

    public List<SectionResponseDTO> GetAllSections()
    {
        return [.. _sections.Select(MapToResponse)];
    }

    public SectionResponseDTO? GetSectionById(int id)
    {
        var section = _sections.FirstOrDefault(s => s.Id == id);
        return section is null ? null : MapToResponse(section);
    }

    public SectionResponseDTO? GetSectionByCode(string code)
    {
        var section = _sections.FirstOrDefault(s => string.Equals(s.Code, code, StringComparison.OrdinalIgnoreCase));
        return section is null ? null : MapToResponse(section);
    }

    public SectionResponseDTO Create(SectionCreateDTO sectionCreateDTO)
    {
        var nextId = _sections.Count == 0 ? 1 : _sections.Max(s => s.Id) + 1;
        var section = new Section
        {
            Id = nextId,
            Code = sectionCreateDTO.Code
        };

        _sections.Add(section);
        return MapToResponse(section);
    }

    public bool Update(int id, SectionUpdateDTO sectionUpdateDTO)
    {
        var section = _sections.FirstOrDefault(s => s.Id == id);
        if (section is null)
        {
            return false;
        }

        section.Code = sectionUpdateDTO.Code;
        return true;
    }

    public bool Patch(int id, SectionPatchDTO sectionPatchDTO)
    {
        var section = _sections.FirstOrDefault(s => s.Id == id);
        if (section is null)
        {
            return false;
        }

        if (!string.IsNullOrWhiteSpace(sectionPatchDTO.Code))
        {
            section.Code = sectionPatchDTO.Code;
        }

        return true;
    }

    public bool Delete(int id)
    {
        var section = _sections.FirstOrDefault(s => s.Id == id);
        if (section is null)
        {
            return false;
        }

        _sections.Remove(section);
        return true;
    }

    private static SectionResponseDTO MapToResponse(Section section)
    {
        return new SectionResponseDTO
        {
            Id = section.Id,
            Code = section.Code,
            StudentCount = section.Students.Count
        };
    }
}