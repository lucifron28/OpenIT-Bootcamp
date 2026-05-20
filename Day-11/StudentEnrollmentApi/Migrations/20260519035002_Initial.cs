using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentEnrollmentApi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Section_Programs_ProgramsId",
                table: "Section");

            migrationBuilder.AlterColumn<int>(
                name: "ProgramsId",
                table: "Section",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Section_Programs_ProgramsId",
                table: "Section",
                column: "ProgramsId",
                principalTable: "Programs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Section_Programs_ProgramsId",
                table: "Section");

            migrationBuilder.AlterColumn<int>(
                name: "ProgramsId",
                table: "Section",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Section_Programs_ProgramsId",
                table: "Section",
                column: "ProgramsId",
                principalTable: "Programs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
