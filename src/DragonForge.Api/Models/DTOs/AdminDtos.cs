namespace DragonForge.Api.Models.DTOs;

public record AdminOverviewResponse(
    int TotalParents,
    int TotalChildren,
    int TotalAttempts,
    int AttemptsLast7Days,
    int AttemptsLast30Days,
    int ActiveChildrenLast7Days,
    int ActiveChildrenLast30Days,
    int NewParentsLast7Days,
    int NewParentsLast30Days,
    decimal AverageWpm,
    decimal AverageAccuracy,
    int TotalPointsAwarded,
    Dictionary<string, int> StageDistribution
);

public record AdminParentRow(
    Guid Id,
    string Email,
    string DisplayName,
    DateTime CreatedAt,
    int ChildCount,
    int TotalAttempts,
    DateTime? LastAttemptAt,
    List<AdminChildRow> Children
);

public record AdminChildRow(
    Guid Id,
    string DisplayName,
    string CurrentStage,
    int TotalPoints,
    int HighestLevelCompleted,
    int AttemptCount,
    DateTime? LastAttemptAt,
    decimal? AverageWpm,
    decimal? AverageAccuracy,
    DateTime CreatedAt
);

public record AdminLevelStats(
    int LevelNumber,
    string Title,
    string Phase,
    int AttemptCount,
    int PassCount,
    decimal PassRate,
    decimal? AverageWpm,
    decimal? AverageAccuracy,
    int UniquePlayers
);

public record AdminActivityPoint(
    DateTime Date,
    int Attempts,
    int UniqueChildren,
    int NewParents
);

public record AdminChildDetailResponse(
    AdminChildRow Child,
    string ParentEmail,
    List<AdminAttemptRow> RecentAttempts
);

public record AdminAttemptRow(
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
