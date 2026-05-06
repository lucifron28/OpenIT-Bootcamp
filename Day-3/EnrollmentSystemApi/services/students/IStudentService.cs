using EnrollmentSystemApi.DTOs.Students;

namespace EnrollmentSystemApi.Services.Students;

public interface IStudentService
{
    List<StudentResponseDTO> GetAllStudents();
    StudentResponseDTO? GetStudentById(int id);
    List<StudentResponseDTO>? GetStudentsBySectionCode(string sectionCode);
    StudentResponseDTO? GetStudentBySectionCodeAndId(string sectionCode, int studentId);
    List<StudentResponseDTO> SearchStudents(string? firstName, string? lastName, string? gender, int? age);
    StudentResponseDTO Create(StudentCreateDTO studentCreateDTO);
    bool Update(int id, StudentUpdateDTO studentUpdateDTO);
    bool Patch(int id, StudentPatchDTO studentPatchDTO);
    bool Delete(int id);
}