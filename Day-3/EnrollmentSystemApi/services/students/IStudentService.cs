using EnrollmentSystemApi.DTOs.Students;

interface IStudentService
{
    Task<IEnumerable<StudentResponseDTO>> GetAllAsync();
    Task<StudentResponseDTO?> GetByIdAsync(int id);
    Task<StudentResponseDTO> CreateAsync(StudentCreateDTO studentCreateDTO);
    Task<StudentResponseDTO?> UpdateAsync(int id, StudentUpdateDTO studentUpdateDTO);
    Task<StudentResponseDTO?> PatchAsync(int id, StudentPatchDTO studentPatchDTO);
    Task<bool> DeleteAsync(int id);
}