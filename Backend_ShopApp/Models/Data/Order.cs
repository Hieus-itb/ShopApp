using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend_ShopApp.Models.Data
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Foreign key to the User who placed the order
        public int UserId { get; set; }

        [Column(TypeName = "decimal(18, 2)")] // Use decimal for currency
        public decimal TotalPrice { get; set; }

        [Column(TypeName = "decimal(18, 2)")] // Use decimal for currency
        public decimal Tax { get; set; }

        public string Status { get; set; } = "Pending"; // Add Status property with a default value
        public string? PaymentMethod { get; set; } // Add PaymentMethod property
        public bool IsPaid { get; set; } = false; // Add IsPaid property with a default value

        public DateTime OrderDate { get; set; } = DateTime.UtcNow; // Timestamp for when the order was placed

        // Foreign key to the Address used for this order
        public int AddressId { get; set; }

        [ForeignKey("AddressId")]
        public Address Address { get; set; }

        // Navigation property for the user who placed the order
        [ForeignKey("UserId")]
        public User User { get; set; }

        // Navigation property for the items in this order
        [JsonIgnore]
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}