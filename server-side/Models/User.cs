using Microsoft.EntityFrameworkCore;

namespace WebServer.Models
{
    public class User
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? SecondName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public ICollection<ProcessTask> ProcessTasks { get;} = new List<ProcessTask>();
    }
}
