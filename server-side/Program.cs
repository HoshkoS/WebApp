using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebServer.Configureation;
using WebServer.Models;

namespace WebServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.


            builder.Services.AddControllers();

            Configurations.ConfigureDB(builder);
            Configurations.ConfigureJWTService(builder);
            Configurations.ConfigureSwagger(builder.Services);
            Configurations.ConfigureCORS(builder.Services);
            Configurations.ConfigureJobService(builder.Services);

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            Configurations.ConfigureJWT(app);

            app.UseCors();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}