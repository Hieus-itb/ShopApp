using System.ComponentModel.DataAnnotations;

namespace Backend_ShopApp.Models.Requests
{
    public class AddAddressRequest
    {
        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string ZipCode { get; set; }
    }
}