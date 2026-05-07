using EnrollmentSystemApi.Services.Sections;
using EnrollmentSystemApi.Services.Students;
using EnrollmentSystemApi.Data;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<InMemoryEnrollmentStore>();
builder.Services.AddSingleton<ISectionService, SectionService>();
builder.Services.AddSingleton<IStudentService, StudentService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var random = new Random();

app.UseHttpsRedirection();

//app.UseMiddleware<RandomGradeGeneratorMiddleware>();
//app.UseRandomGradeGenerator();
app.Use(async (context, next) =>
{
    context.Request.EnableBuffering();

    if (context.Request.ContentLength > 0 && context.Request.ContentType?.Contains("application/json") == true)
    {
        using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
        var body = await reader.ReadToEndAsync();

        var jsonObject = JsonSerializer.Deserialize<Dictionary<string, object>>(body);
        if (jsonObject != null)
        {
            jsonObject["Grade"] = random.Next(75, 100);

            var modifiedBody = JsonSerializer.Serialize(jsonObject);
            var byteArray = Encoding.UTF8.GetBytes(modifiedBody);
            context.Request.Body = new MemoryStream(byteArray);
            context.Request.ContentLength = byteArray.Length;
        }

        context.Request.Body.Position = 0;
        await next(context);
    }
});

app.MapControllers();
app.Run();
