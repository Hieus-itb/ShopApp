using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Backend_ShopApp.Models.Data
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }

        // Foreign key to the Category
        public string CategoryId { get; set; } // Add foreign key property

        public string Name { get; set; }
        public decimal Price { get; set; }
        public double Rating { get; set; }
        public string Distance { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation property to link Product to Category
        [ForeignKey("CategoryId")] // Link to the CategoryId foreign key
        [ValidateNever]
        public Category Category { get; set; } // Add navigation property
    }
}