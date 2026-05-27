using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using ZenLogWEBAPI.Data;
using ZenLogWEBAPI.DTO;
using Microsoft.EntityFrameworkCore;

namespace ZenLogWEBAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public readonly AppDbContext _dbContext;
        public readonly IConfiguration _config;

        public AuthController(AppDbContext dbContext,IConfiguration config) { 
            _dbContext = dbContext;
            _config = config;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserDTO user)
        {
            if (await _dbContext.Auths.AnyAsync(a => a.Email == user.Email))
            {
                return BadRequest("Email already exists.");
            }
            byte[] passwordSalt = new byte[128 / 8];
            byte[] passwordHash = CreatePasswordHash(user.Password, passwordSalt);
            var auth = new Entities.Auth
            {
                Email = user.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };
            var newUser = new Entities.User
            {
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = DateTime.UtcNow
            };
            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.Auths.AddAsync(auth);
            await _dbContext.SaveChangesAsync();
            return Ok("User registered successfully.");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUserDTO user)
        {
            if(User == null)
            {
                return BadRequest("Invalid email or password.");
            }
            var auth = await _dbContext.Auths.FirstOrDefaultAsync(a => a.Email == user.Email);
            if (auth == null)
            {
                return BadRequest("Invalid email or password.");
            }
            byte[] passwordHash = CreatePasswordHash(user.Password, auth.PasswordSalt);
            if (!passwordHash.SequenceEqual(auth.PasswordHash))
            {
                return BadRequest("Invalid email or password.");
            }
            var loggedUser = await _dbContext.Users.FirstOrDefaultAsync(a => a.Email == user.Email);
            return Ok(loggedUser);
        }

        private byte[] CreatePasswordHash(string password, byte[] passwordSalt)
        {
            string passSaltPlusKey = _config.GetSection("PasswordSaltKey").Value + Convert.ToBase64String(passwordSalt);
            return KeyDerivation.Pbkdf2(
                password: password,
                salt: Encoding.UTF8.GetBytes(passSaltPlusKey),
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8);
        }
    }
}
