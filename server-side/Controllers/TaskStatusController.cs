using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebServer.DTO;
using WebServer.Models;
using WebServer.Services;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskStatusController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly ApiDbContext _context;
        private readonly IConfiguration _config;
        private readonly IProcessService _processService;

        public TaskStatusController(ILogger<AuthenticationController> logger, ApiDbContext context, IConfiguration config, IProcessService processService)
        {
            _logger = logger;
            _context = context;
            _config = config;
            _processService = processService;
        }

        [AllowAnonymous]
        [HttpGet(Name = "GetAllActiveTasks")]
        public async Task<IActionResult> GetAllTasksStatusController()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;

            if (claimsIdentity != null)
            {
                var userId = long.Parse(claimsIdentity?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var activeTasks = await _context.ProcessTasks
                    .Where(t => t.active == true && t.UserId == userId)
                    .ToListAsync();
                return Ok(activeTasks);
            }
            return BadRequest();
        }


        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetTaskPercentage")]
        public async Task<IActionResult> GetTaskStatusController(long? id)
        {
            var task = await _context.ProcessTasks.FirstOrDefaultAsync(x => x.Id == id);
            if(task != null) 
            {
                return Ok(task);
            }
            return BadRequest();
        }

        [AllowAnonymous]
        [HttpPost(Name = "StartTask")]
        public async Task<IActionResult> StartTaskController(StartTaskParams taskParams)
        {
            Console.WriteLine("StartTaskController");
            await _processService.StartProcess(taskParams.taskId);
            return Ok("job started.");
        }
    }
}
