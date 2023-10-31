using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebServer.DTO;
using WebServer.Models;
using WebServer.Utils;

namespace WebServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly ApiDbContext _context;
        private readonly IConfiguration _config;

        public AuthenticationController(ILogger<AuthenticationController> logger, ApiDbContext context, IConfiguration config)
        {
            _logger = logger;
            _context = context;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost(Name = "Login")]
        public async Task<IActionResult> LoginController([FromBody] UserLoginDto login)
        {
            IActionResult response = Unauthorized();
            var h = Hashing.getHash(login.Password);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Password == Hashing.getHash(login.Password) && u.Email == login.Email);
            if (user != null)
            {
                var tokenString = JwyUtils.GenerateJSONWebToken(_config, user);
                response = Ok(new { token = tokenString });
            }
            return response;
        }
    }
}
