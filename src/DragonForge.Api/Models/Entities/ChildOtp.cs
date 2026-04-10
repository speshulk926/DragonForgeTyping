namespace DragonForge.Api.Models.Entities;

public class ChildOtp
{
    public Guid Id { get; set; }
    public Guid ChildProfileId { get; set; }
    public ChildProfile ChildProfile { get; set; } = null!;

    public string Code { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public bool Used { get; set; }
}
