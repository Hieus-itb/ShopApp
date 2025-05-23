using Microsoft.EntityFrameworkCore;
using Backend_ShopApp.Models.Data;

namespace Backend_ShopApp.Data
{
    public class ShopDbContext : DbContext
    {
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; } // Add this line
        public DbSet<OrderItem> OrderItems { get; set; } // Add this line
        public DbSet<Address> Addresses { get; set; } // Add this line

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure primary keys if not already done by conventions
            modelBuilder.Entity<Category>().HasKey(c => c.Id);
            modelBuilder.Entity<Product>().HasKey(p => p.Id);

            // Optional: Configure relationships if needed
            // modelBuilder.Entity<Product>()
            //     .HasOne(p => p.CategoryNavigation)
            //     .WithMany()
            //     .HasForeignKey(p => p.Category);
        }
    }
}