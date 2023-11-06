using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebServer.DTO;
using WebServer.Models;
using WebServer.Services;


namespace WebServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ILogger<TaskController> _logger;
        private readonly ApiDbContext _context;
        private IProcessService _processService;
        private static Dictionary<long?, CancellationTokenSource> cts = new Dictionary<long?, CancellationTokenSource>();

        public TaskController(ILogger<TaskController> logger, ApiDbContext context, IProcessService processService)
        {
            _logger = logger;
            _context = context;
            _processService = processService;
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
        [Authorize]
        [HttpPut(Name = "StartTask")]
        public async Task StartTaskController(StartTaskParams taskParams)
        {
            cts[taskParams.TaskId] = new CancellationTokenSource();
            await _processService.StartProcess(taskParams.TaskId, cts[taskParams.TaskId].Token);
        }

        [Authorize]
        [HttpPatch("StopTask/{id}", Name = "StopTask")]
        public async Task<ActionResult> StopTaskController(long? id)
        {
            if (cts.ContainsKey(id))
            {
                cts[id].Cancel();
                cts[id].Dispose();
                cts.Remove(id);
                return Ok();
            }
            else
            {
                using (HttpClient client = new HttpClient())
                {
                    try
                    {
                        string apiUrl = $"https://localhost:7269/Task/StopTask/{id}";
                        var content = new StringContent(id.ToString());

                        // Send a PATCH request
                        await client.PatchAsync(apiUrl, content);
                        return Ok();
                    }
                    catch (HttpRequestException ex)
                    {
                        // Handle any exceptions that may occur during the request.
                        return BadRequest();
                    }
                }
            }
        }

        [Authorize]
        [HttpGet("{id}", Name = "GetTask")]
        public async Task<IActionResult> GetTaskController(long? id)
        {
            var task = await _context.ProcessTasks.FirstOrDefaultAsync(x => x.Id == id);
            if (task != null)
            {
                return Ok(task);
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
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProcessTask(long? id)
        {
            var processTask = await _context.ProcessTasks.FindAsync(id);

            if (processTask == null)
            {
                return NotFound(); // Return a 404 Not Found response if the task with the specified ID is not found.
            }

            _context.ProcessTasks.Remove(processTask);
            await _context.SaveChangesAsync();

            return NoContent(); // Return a 204 No Content response to indicate successful deletion.
        }
    }
}
