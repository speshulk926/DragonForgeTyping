using System.Text.Json;
using System.Text.Json.Serialization;
using DragonForge.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<LevelDefinition> LevelDefinitions => Set<LevelDefinition>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<LevelDefinition>(entity =>
        {
            entity.HasIndex(e => e.LevelNumber).IsUnique();
            entity.Property(e => e.PromptTexts)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>());
            entity.Property(e => e.Phase).HasConversion<string>();
        });

        SeedLevels(modelBuilder);
    }

    private static void SeedLevels(ModelBuilder modelBuilder)
    {
        var seedPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "LevelSeedData.json");
        if (!File.Exists(seedPath)) return;

        var json = File.ReadAllText(seedPath);
        var levels = JsonSerializer.Deserialize<List<LevelDefinition>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        });

        if (levels != null)
        {
            modelBuilder.Entity<LevelDefinition>().HasData(levels);
        }
    }
}
