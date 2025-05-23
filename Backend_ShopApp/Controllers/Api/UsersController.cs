using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend_ShopApp.Data;
using Backend_ShopApp.Models.Data;
using Backend_ShopApp.Models.Requests;
using Microsoft.AspNetCore.Identity;

namespace Backend_ShopApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ShopDbContext _context;

        public UsersController(ShopDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> SaveUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                return Conflict(new { message = "Email đã được sử dụng." }); // HTTP 409
            }

            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, user.Password); // Mã hóa

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
            if (user == null)
            {
                return Unauthorized("Email không tồn tại");
            }

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.Password, loginRequest.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Sai mật khẩu");
            }

            // Return user info (ẩn mật khẩu)
            var userResponse = new
            {
                user.Id,
                user.Username,
                user.Date,
                user.Gender,
                user.Phone,
                user.Email,
                user.Avatar,
                // Removed Address, City, House as they are now in the Address model
            };

            return Ok(userResponse);
        }

        // PUT: api/Users/{id}
        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Cập nhật các field
            existingUser.Username = updatedUser.Username;
            existingUser.Date = updatedUser.Date;
            existingUser.Gender = updatedUser.Gender;
            existingUser.Phone = updatedUser.Phone;
            existingUser.Avatar = updatedUser.Avatar;
            // Removed Address, City, House as they are now in the Address model

            _context.Entry(existingUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Trả về thông tin không bao gồm mật khẩu
            var userResponse = new
            {
                user.Id,
                user.Username,
                user.Date,
                user.Gender,
                user.Phone,
                user.Email,
                user.Avatar,
                // Removed Address, City, House as they are now in the Address model
            };

            return Ok(userResponse);
        }


        // POST: api/Users/{userId}/Addresses
        [HttpPost("{userId}/Addresses")]
        public async Task<IActionResult> AddAddress(int userId, [FromBody] AddAddressRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            var address = new Address
            {
                UserId = userId,
                Street = request.Street,
                City = request.City,
                State = request.State,
                ZipCode = request.ZipCode
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAddressesByUserId), new { userId = address.UserId }, address);
        }

        // GET: api/Users/{userId}/Addresses
        [HttpGet("{userId}/Addresses")]
        public async Task<ActionResult<IEnumerable<Address>>> GetAddressesByUserId(int userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound($"User với ID {userId} không tồn tại.");
            }

            var addresses = await _context.Addresses
                                        .Where(a => a.UserId == userId)
                                        .ToListAsync();

            return Ok(addresses);
        }
        // DELETE: api/Users/{userId}/Addresses/{addressId}
        [HttpDelete("{userId}/Addresses/{addressId}")]
        public async Task<IActionResult> DeleteAddress(int userId, int addressId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return NotFound($"User với ID {userId} không tồn tại.");
            }

            var address = await _context.Addresses
                                        .Where(a => a.UserId == userId && a.Id == addressId)
                                        .FirstOrDefaultAsync();

            if (address == null)
            {
                return NotFound($"Địa chỉ với  ID {addressId} không tồn tới với user có ID {userId}.");
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
