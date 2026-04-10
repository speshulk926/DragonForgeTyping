using System.Text.Json;
using System.Text.Json.Serialization;
using DragonForge.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Data;

public class AppDbContext : IdentityDbContext<Parent, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<LevelDefinition> LevelDefinitions => Set<LevelDefinition>();
    public DbSet<ChildProfile> ChildProfiles => Set<ChildProfile>();
    public DbSet<LevelAttempt> LevelAttempts => Set<LevelAttempt>();
    public DbSet<DeviceSession> DeviceSessions => Set<DeviceSession>();
    public DbSet<ChildOtp> ChildOtps => Set<ChildOtp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // LevelDefinition
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

        // ChildProfile
        modelBuilder.Entity<ChildProfile>(entity =>
        {
            entity.HasOne(e => e.Parent)
                .WithMany(p => p.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.CurrentStage).HasConversion<string>();
        });

        // LevelAttempt
        modelBuilder.Entity<LevelAttempt>(entity =>
        {
            entity.HasOne(e => e.ChildProfile)
                .WithMany(c => c.Attempts)
                .HasForeignKey(e => e.ChildProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.LevelDefinition)
                .WithMany()
                .HasForeignKey(e => e.LevelDefinitionId);
            entity.Property(e => e.Wpm).HasPrecision(6, 1);
            entity.Property(e => e.Accuracy).HasPrecision(5, 1);
        });

        // DeviceSession
        modelBuilder.Entity<DeviceSession>(entity =>
        {
            entity.HasOne(e => e.ChildProfile)
                .WithMany(c => c.DeviceSessions)
                .HasForeignKey(e => e.ChildProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.TokenHash).IsUnique();
        });

        // ChildOtp
        modelBuilder.Entity<ChildOtp>(entity =>
        {
            entity.HasOne(e => e.ChildProfile)
                .WithMany()
                .HasForeignKey(e => e.ChildProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.Code);
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
