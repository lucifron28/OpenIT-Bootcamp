using System.ComponentModel.DataAnnotations;

namespace StudentEnrollmentApi.DTOs;

public class StudentPatchDto
{
    [StringLength(50)]
    public string? FirstName { get; set; }

    [StringLength(50)]
    public string? LastName { get; set; }

    [StringLength(20)]
    public string? Gender { get; set; }

    [Range(1, 10)]
    public int? Year { get; set; }

    [StringLength(100)]
    public string? OldSchool { get; set; }

    [StringLength(20)]
    public string? EnrolledStatus { get; set; }

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(200)]
    public string? Address { get; set; }

    public bool HasAnyChanges =>
        FirstName is not null ||
        LastName is not null ||
        Gender is not null ||
        Year.HasValue ||
        OldSchool is not null ||
        EnrolledStatus is not null ||
        Department is not null ||
        Address is not null;
}