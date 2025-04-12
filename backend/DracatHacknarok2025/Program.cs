
using DracatHacknarok2025.DB;
using Microsoft.EntityFrameworkCore;

namespace DracatHacknarok2025
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var dbConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            if(dbConnectionString == null)
                throw new Exception("Database connection string not found.");
            
            builder.Services.AddDbContext<OfferDbContext>(options =>
            {
                options.UseMySQL(connectionString: dbConnectionString);
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
