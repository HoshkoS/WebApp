using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace WebServer.Models
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(e => e.ProcessTasks)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .IsRequired(false);
        }
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<ProcessTask> ProcessTasks { get; set; }
    }
}
