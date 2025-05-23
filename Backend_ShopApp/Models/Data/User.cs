using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_ShopApp.Models.Data
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Assuming the ID is auto-generated in the database
        public int Id { get; set; } // Changed to int based on the JS code's id: users.length + 1
        public string Username { get; set; }
        public string Date { get; set; } // Consider using DateTime if possible
        public string Gender { get; set; }
        public string Phone { get; set; }
        [Required] // Email is used for finding existing users, so it should be required
        public string Email { get; set; }
        public string Password { get; set; }
        public string Avatar { get; set; }
        public ICollection<Address> Addresses { get; set; }
    }
}