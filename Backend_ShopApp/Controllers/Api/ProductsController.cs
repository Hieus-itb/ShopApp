using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Backend_ShopApp.Data; // Add this using directive

namespace Backend_ShopApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ShopDbContext _context; // Add a field for the database context

        // Add a constructor to inject the database context
        public ProductsController(ShopDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            // Retrieve products from the database
            var products = _context.Products.ToList();

            return Ok(products);
        }
    }
}