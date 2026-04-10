namespace DragonForge.Api.Models.Entities;

public class DeviceSession
{
    public Guid Id { get; set; }
    public Guid ChildProfileId { get; set; }
    public ChildProfile ChildProfile { get; set; } = null!;

    public string TokenHash { get; set; } = string.Empty;
    public string? DeviceName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
}
