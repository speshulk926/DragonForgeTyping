namespace DragonForge.Api.Models.Entities;

public class LevelDefinition
{
    public int Id { get; set; }
    public int LevelNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LevelPhase Phase { get; set; }
    public List<string> PromptTexts { get; set; } = [];
    public int BasePoints { get; set; }
    public int? MinWpmForBonus { get; set; }
}

public enum LevelPhase
{
    Egg,
    Hatchling,
    Drake,
    Beyond
}
