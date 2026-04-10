using Microsoft.AspNetCore.Identity;

namespace DragonForge.Api.Models.Entities;

public class Parent : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ChildProfile> Children { get; set; } = [];
}
