using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_ShopApp.Models.Data
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Foreign key to the Order this item belongs to
        public int OrderId { get; set; }

        // Foreign key to the Product being ordered
        public string ProductId { get; set; } // Assuming Product Id is string based on your JSON

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18, 2)")] // Price of the product at the time of order
        public decimal Price { get; set; }

        // Navigation property for the Order
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        // Navigation property for the Product
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}