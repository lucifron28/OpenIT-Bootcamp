using System;
using Microsoft.EntityFrameworkCore;
using StudentEnrollmentApi.Models;

namespace StudentEnrollmentApi;

public class EnrollmentContext : DbContext
{
    public DbSet<Student> Student { get; set; }
    public DbSet<Section> Section { get; set; }
    public DbSet<Programs> Programs { get; set; }
    public DbSet<StudentSection> StudentSection { get; set; }
    public DbSet<StudentGrades> StudentGrades { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=enrollmentapi;Username=postgres;Password=ccms");
    }
}
