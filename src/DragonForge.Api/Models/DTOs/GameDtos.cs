namespace DragonForge.Api.Models.DTOs;

public record GameProfileResponse(
    Guid Id,
    string DisplayName,
    string CurrentStage,
    int TotalPoints,
    int HighestLevelCompleted
);

public record SubmitAttemptRequest(
    int LevelNumber,
    decimal Wpm,
    decimal Accuracy,
    int HeartsRemaining,
    int PointsAwarded,
    bool Passed
);

public record AttemptResponse(
    Guid Id,
    int LevelNumber,
    string LevelTitle,
    decimal Wpm,
    decimal Accuracy,
    int HeartsRemaining,
    int PointsAwarded,
    bool Passed,
    DateTime CompletedAt
);
