using System.Collections.Generic;
using StudentEnrollmentApi.DTOs;

namespace StudentEnrollmentApi.Services;

public interface IStudentService
{
    IEnumerable<StudentResponseDto> GetAll(
        string? gender = null,
        string? department = null,
        int? year = null,
        string? oldSchool = null,
        string? enrolledStatus = null,
        string? name = null
    );
    StudentResponseDto? GetById(int id);
    StudentResponseDto Create(StudentCreateDto dto);
    bool Update(int id, StudentCreateDto dto);
    bool Patch(int id, StudentPatchDto dto);
    bool Delete(int id);
    object GetStats();
    IEnumerable<string> GetOldSchools();
}
