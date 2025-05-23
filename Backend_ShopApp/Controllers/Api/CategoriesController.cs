using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Backend_ShopApp.Data; // Add this using directive

namespace Backend_ShopApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ShopDbContext _context; // Add a field for the database context

        // Add a constructor to inject the database context
        public CategoriesController(ShopDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            // Retrieve categories from the database
            var categories = _context.Categories.ToList();

            return Ok(categories);
        }
    }
}