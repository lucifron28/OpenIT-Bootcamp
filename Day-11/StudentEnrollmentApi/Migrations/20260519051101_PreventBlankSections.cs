using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentEnrollmentApi.Migrations
{
    /// <inheritdoc />
    public partial class PreventBlankSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "DELETE FROM \"StudentSection\" WHERE \"SectionId\" IN (SELECT \"Id\" FROM \"Section\" WHERE \"Year\" <= 0 OR \"ProgramId\" <= 0 OR btrim(\"Code\") = '')");

            migrationBuilder.Sql(
                "DELETE FROM \"Section\" WHERE \"Year\" <= 0 OR \"ProgramId\" <= 0 OR btrim(\"Code\") = ''");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Section_RequiredFields",
                table: "Section",
                sql: "\"Year\" > 0 AND \"ProgramId\" > 0 AND btrim(\"Code\") <> ''");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Section_RequiredFields",
                table: "Section");
        }
    }
}
