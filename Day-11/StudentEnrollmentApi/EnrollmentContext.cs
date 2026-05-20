using System;
using Microsoft.EntityFrameworkCore;
using StudentEnrollmentApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace StudentEnrollmentApi;

public class EnrollmentContext(DbContextOptions<EnrollmentContext> options) : IdentityDbContext<ApplicationUser>(options) 
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
