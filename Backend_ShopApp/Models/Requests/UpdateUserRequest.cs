using System.ComponentModel.DataAnnotations;

namespace Backend_ShopApp.Models.Requests
{
    public class UpdateUserRequest
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Date { get; set; }
    public string Gender { get; set; }
    public string Phone { get; set; }
    public string Avatar { get; set; }

}

}