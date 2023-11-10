using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebServer.Models;
using WebServer.Utils;
using WebServer.Validation;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly ApiDbContext _context;
        private readonly IConfiguration _config;

        public RegistrationController(ILogger<AuthenticationController> logger, ApiDbContext context, IConfiguration config)
        {
            _logger = logger;
            _context = context;
            _config = config;
        }

        [HttpGet(Name = "GetUsers")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpPost(Name = "Register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(User user)
        {
            if (ValidationManager.UserIsValid(user))
            {
                user.Password = Hashing.getHash(user.Password);
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                var tokenString = JwtUtils.GenerateJSONWebToken(_config, user);
                return Ok(new { token = tokenString });
            }
            return BadRequest("User validation error.");
        }
    }
}