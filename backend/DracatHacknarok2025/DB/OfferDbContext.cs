using DracatHacknarok2025.Model;
using Microsoft.EntityFrameworkCore;

namespace DracatHacknarok2025.DB;

public class OfferDbContext(DbContextOptions<OfferDbContext> options) : DbContext(options)
{
    public DbSet<OfferEntryModel> OfferEntries { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OfferEntryModel>()
            .Property(o => o.Name)
            .HasMaxLength(200);
        
        modelBuilder.Entity<OfferEntryModel>()
            .Property(o => o.Description)
            .HasMaxLength(500);
    }
}