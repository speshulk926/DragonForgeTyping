namespace DragonForge.Api.Models.DTOs;

public record CreateChildRequest(string DisplayName, string? AvatarChoice);
public record UpdateChildRequest(string DisplayName, string? AvatarChoice);

public record ChildResponse(
    Guid Id,
    string DisplayName,
    string? AvatarChoice,
    string CurrentStage,
    int TotalPoints,
    int HighestLevelCompleted,
    DateTime CreatedAt
);
