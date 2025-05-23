using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend_ShopApp.Data;
using Backend_ShopApp.Models.Data;
using Backend_ShopApp.Models.Requests; // Add this using directive

namespace Backend_ShopApp.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ShopDbContext _context;

        public OrdersController(ShopDbContext context)
        {
            _context = context;
        }

        // POST: api/Orders/Checkout
        [HttpPost("Checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest checkoutRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new Order from the checkout request
            var order = new Order
            {
                UserId = checkoutRequest.UserId,
                TotalPrice = checkoutRequest.TotalPrice,
                Tax = checkoutRequest.Tax,
                OrderDate = DateTime.UtcNow,
                PaymentMethod = checkoutRequest.PaymentMethod,
                AddressId = checkoutRequest.AddressId, // Add AddressId
                OrderItems = new List<OrderItem>() // Initialize the collection
            };

            // Add the order to the context
            _context.Orders.Add(order);

            // Create OrderItems from the checkout request items
            foreach (var itemRequest in checkoutRequest.OrderItems)
            {
                var orderItem = new OrderItem
                {
                    ProductId = itemRequest.ProductId,
                    Quantity = itemRequest.Quantity,
                    Price = itemRequest.Price,
                    // OrderId will be set automatically by EF Core when saving the order
                };
                order.OrderItems.Add(orderItem); // Link the item to the order
            }

            try
            {
                // Save the order and its items to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Handle potential database errors (e.g., foreign key constraints)
                // Log the exception details for debugging
                Console.WriteLine($"Error saving order: {ex.Message}");
                return StatusCode(500, "An error occurred while saving the order.");
            }


            var createdOrderResponse = new
            {
                order.Id,
                order.UserId,
                order.TotalPrice,
                order.Tax,
                order.OrderDate,
                order.AddressId, // Include AddressId in the response
                OrderItems = order.OrderItems.Select(oi => new
                {
                    oi.Id,
                    oi.ProductId,
                    oi.Quantity,
                    oi.Price
                }).ToList()
            };


            return Ok(createdOrderResponse);
        }

        // GET: api/Orders/ByUser/{userId}
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUserId(int userId)
        {
            var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Address) 
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .ToListAsync();


            if (orders == null || !orders.Any())
            {
                return NotFound($"No orders found for user with ID {userId}");
            }



            return Ok(orders.Select(order => new
            {
                order.Id,
                order.UserId,
                order.TotalPrice,
                order.Tax,
                order.Status,
                order.PaymentMethod,
                order.IsPaid,
                order.OrderDate,
                
                Address = new
                {
                    order.Address.Id,
                    order.Address.State,
                    order.Address.City,
                    order.Address.Street
                },
                OrderItems = order.OrderItems.Select(oi => new
                {
                    ProductName = oi.Product.Name,
                    oi.Quantity,
                    oi.Price
                })
            }));
        }
    }
}