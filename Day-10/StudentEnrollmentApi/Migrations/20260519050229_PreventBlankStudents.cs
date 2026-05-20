using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentEnrollmentApi.Migrations
{
    /// <inheritdoc />
    public partial class PreventBlankStudents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "DELETE FROM \"Student\" WHERE \"Year\" <= 0 OR btrim(\"FirstName\") = '' OR btrim(\"LastName\") = '' OR btrim(\"Gender\") = ''");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Student_RequiredFields",
                table: "Student",
                sql: "\"Year\" > 0 AND btrim(\"FirstName\") <> '' AND btrim(\"LastName\") <> '' AND btrim(\"Gender\") <> ''");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Student_RequiredFields",
                table: "Student");
        }
    }
}
