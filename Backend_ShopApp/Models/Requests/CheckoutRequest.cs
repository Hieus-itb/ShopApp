using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend_ShopApp.Models.Requests
{
    public class CheckoutRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(0, double.MaxValue)] // Ensure total price is non-negative
        public decimal TotalPrice { get; set; }

        [Required]
        [Range(0, double.MaxValue)] // Ensure tax is non-negative
        public decimal Tax { get; set; }

        [Required]
        public List<CheckoutItemRequest> OrderItems { get; set; }
        public string? PaymentMethod { get; set; }

        [Required]
        public int AddressId { get; set; }
    }

    public class CheckoutItemRequest
    {
        [Required]
        public string ProductId { get; set; } // Assuming Product Id is string

        [Required]
        [Range(1, int.MaxValue)] // Ensure quantity is at least 1
        public int Quantity { get; set; }

        [Required]
        [Range(0, double.MaxValue)] // Ensure price is non-negative
        public decimal Price { get; set; } // Price at the time of order
    }
}