using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebServer.DTO;
using WebServer.Models;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ILogger<TaskController> _logger;
        private readonly ApiDbContext _context;

        public TaskController(ILogger<TaskController> logger, ApiDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetUserTasks")]
        [Authorize]
        public async Task<ActionResult> GetAllUserTaskController(bool? done)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            if (claimsIdentity != null)
            {
                var userId = long.Parse(claimsIdentity.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var response = _context.ProcessTasks.Where(e => e.UserId == userId).ToList();
                if (done != null && response != null)
                {
                    if (done == true)
                    {
                        response = response.Where(e => e.percentage == 100).ToList();
                    }
                    else
                    {
                        response = response.Where(e => e.percentage < 100).ToList();
                    }
                }
                return Ok(response);
            }
            return BadRequest();
        }

        [HttpPost(Name = "CreateProcessTask")]
        [Authorize]
        public async Task<ActionResult> CreateTaskController(TaskParams taskParams)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;

            if (claimsIdentity != null)
            {
                var userId = long.Parse(claimsIdentity.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var sender = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                ProcessTask activeProcess = new ProcessTask()
                {
                    index = taskParams.Index,
                    percentage = 0,
                    active = false,
                    UserId = userId,
                    User = sender
                };
                await _context.ProcessTasks.AddAsync(activeProcess);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest("User validation error.");
        }
    }
}
