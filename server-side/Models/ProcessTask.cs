using Microsoft.Extensions.Hosting;
using System.Reflection.Metadata;

namespace WebServer.Models
{
    public class ProcessTask
    {
        public long Id { get; set; }
        public DateTime? startDate { get; set; }
        public DateTime? endDate { get; set; }
        public int? index { get; set; }
        public long? percentage { get; set; }
        public bool? active { get; set; }
        public long previousResult { get; set; }
        public long? result { get; set;}
        public long? UserId { get; set; }
        public User? User { get; set; }
    }
}
