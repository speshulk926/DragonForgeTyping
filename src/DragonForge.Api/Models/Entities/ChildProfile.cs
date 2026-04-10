namespace DragonForge.Api.Models.Entities;

public class ChildProfile
{
    public Guid Id { get; set; }
    public Guid ParentId { get; set; }
    public Parent Parent { get; set; } = null!;

    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarChoice { get; set; }
    public EvolutionStage CurrentStage { get; set; } = EvolutionStage.Egg;
    public int TotalPoints { get; set; }
    public int HighestLevelCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<LevelAttempt> Attempts { get; set; } = [];
    public List<DeviceSession> DeviceSessions { get; set; } = [];
}

public enum EvolutionStage
{
    Egg,
    Hatchling,
    Drake,
    YoungDragon,
    FireDrake,
    ElderDragon,
    InfernoDragon
}
