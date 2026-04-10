namespace DragonForge.Api.Models.Entities;

public class LevelAttempt
{
    public Guid Id { get; set; }
    public Guid ChildProfileId { get; set; }
    public ChildProfile ChildProfile { get; set; } = null!;

    public int LevelDefinitionId { get; set; }
    public LevelDefinition LevelDefinition { get; set; } = null!;

    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public decimal Wpm { get; set; }
    public decimal Accuracy { get; set; }
    public int HeartsRemaining { get; set; }
    public int PointsAwarded { get; set; }
    public bool Passed { get; set; }
}
