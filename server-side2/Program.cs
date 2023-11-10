using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebServer.Configuration;
using WebServer.Models;
using Hangfire;

namespace WebServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.


            builder.Services.AddControllers();

            Configurations1.ConfigureDB(builder);
            Configurations1.ConfigureJWTService(builder);
            Configurations1.ConfigureSwagger(builder.Services);
            Configurations1.ConfigureCORS(builder.Services);
            Configurations1.ConfigureProcessService(builder.Services);
            Configurations1.ConfigureHangfire(builder.Services);

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
            app.UseHangfireServer();

            app.UseHttpsRedirection();

            Configurations1.ConfigureJWT(app);

            app.UseCors();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}