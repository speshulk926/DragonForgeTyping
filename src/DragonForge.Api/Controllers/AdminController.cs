using DragonForge.Api.Data;
using DragonForge.Api.Middleware;
using DragonForge.Api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Controllers;

[ApiController]
[Route("api/admin")]
[AdminKey]
public class AdminController(AppDbContext db) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var now = DateTime.UtcNow;
        var sevenDaysAgo = now.AddDays(-7);
        var thirtyDaysAgo = now.AddDays(-30);

        var totalParents = await db.Users.CountAsync();
        var totalChildren = await db.ChildProfiles.CountAsync();
        var totalAttempts = await db.LevelAttempts.CountAsync();

        var attemptsLast7 = await db.LevelAttempts
            .CountAsync(a => a.CompletedAt >= sevenDaysAgo);
        var attemptsLast30 = await db.LevelAttempts
            .CountAsync(a => a.CompletedAt >= thirtyDaysAgo);

        var activeLast7 = await db.LevelAttempts
            .Where(a => a.CompletedAt >= sevenDaysAgo)
            .Select(a => a.ChildProfileId)
            .Distinct()
            .CountAsync();
        var activeLast30 = await db.LevelAttempts
            .Where(a => a.CompletedAt >= thirtyDaysAgo)
            .Select(a => a.ChildProfileId)
            .Distinct()
            .CountAsync();

        var newParents7 = await db.Users.CountAsync(u => u.CreatedAt >= sevenDaysAgo);
        var newParents30 = await db.Users.CountAsync(u => u.CreatedAt >= thirtyDaysAgo);

        var averages = await db.LevelAttempts
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Wpm = (decimal?)g.Average(a => a.Wpm) ?? 0m,
                Accuracy = (decimal?)g.Average(a => a.Accuracy) ?? 0m,
                Points = g.Sum(a => a.PointsAwarded)
            })
            .FirstOrDefaultAsync();

        var stageCounts = await db.ChildProfiles
            .GroupBy(c => c.CurrentStage)
            .Select(g => new { Stage = g.Key.ToString(), Count = g.Count() })
            .ToListAsync();

        var stageDistribution = stageCounts.ToDictionary(s => s.Stage, s => s.Count);

        return Ok(new AdminOverviewResponse(
            totalParents,
            totalChildren,
            totalAttempts,
            attemptsLast7,
            attemptsLast30,
            activeLast7,
            activeLast30,
            newParents7,
            newParents30,
            averages is null ? 0m : Math.Round(averages.Wpm, 1),
            averages is null ? 0m : Math.Round(averages.Accuracy, 1),
            averages?.Points ?? 0,
            stageDistribution
        ));
    }

    [HttpGet("parents")]
    public async Task<IActionResult> GetParents()
    {
        var parents = await db.Users
            .Select(p => new { p.Id, p.Email, p.DisplayName, p.CreatedAt })
            .ToListAsync();

        var children = await db.ChildProfiles
            .Select(c => new
            {
                c.Id,
                c.ParentId,
                c.DisplayName,
                Stage = c.CurrentStage.ToString(),
                c.TotalPoints,
                c.HighestLevelCompleted,
                c.CreatedAt
            })
            .ToListAsync();

        var attemptStats = await db.LevelAttempts
            .GroupBy(a => a.ChildProfileId)
            .Select(g => new
            {
                ChildId = g.Key,
                Count = g.Count(),
                LastAt = g.Max(a => a.CompletedAt),
                AvgWpm = g.Average(a => a.Wpm),
                AvgAccuracy = g.Average(a => a.Accuracy)
            })
            .ToDictionaryAsync(x => x.ChildId);

        var childRowsByParent = children
            .GroupBy(c => c.ParentId)
            .ToDictionary(
                g => g.Key,
                g => g.Select(c =>
                {
                    attemptStats.TryGetValue(c.Id, out var s);
                    return new AdminChildRow(
                        c.Id,
                        c.DisplayName,
                        c.Stage,
                        c.TotalPoints,
                        c.HighestLevelCompleted,
                        s?.Count ?? 0,
                        s?.LastAt,
                        s is null ? null : Math.Round(s.AvgWpm, 1),
                        s is null ? null : Math.Round(s.AvgAccuracy, 1),
                        c.CreatedAt);
                })
                .OrderByDescending(c => c.LastAttemptAt ?? c.CreatedAt)
                .ToList());

        var result = parents
            .Select(p =>
            {
                childRowsByParent.TryGetValue(p.Id, out var kids);
                kids ??= new List<AdminChildRow>();
                var lastAttemptAt = kids
                    .Where(c => c.LastAttemptAt.HasValue)
                    .Select(c => c.LastAttemptAt!.Value)
                    .DefaultIfEmpty()
                    .Max();

                return new AdminParentRow(
                    p.Id,
                    p.Email ?? string.Empty,
                    p.DisplayName ?? string.Empty,
                    p.CreatedAt,
                    kids.Count,
                    kids.Sum(c => c.AttemptCount),
                    lastAttemptAt == default ? null : lastAttemptAt,
                    kids);
            })
            .OrderByDescending(p => p.LastAttemptAt ?? p.CreatedAt)
            .ToList();

        return Ok(result);
    }

    [HttpGet("levels")]
    public async Task<IActionResult> GetLevelStats()
    {
        var levels = await db.LevelDefinitions
            .OrderBy(l => l.LevelNumber)
            .Select(l => new { l.Id, l.LevelNumber, l.Title, Phase = l.Phase.ToString() })
            .ToListAsync();

        var stats = await db.LevelAttempts
            .GroupBy(a => a.LevelDefinitionId)
            .Select(g => new
            {
                LevelId = g.Key,
                Count = g.Count(),
                Passed = g.Count(a => a.Passed),
                AvgWpm = g.Average(a => a.Wpm),
                AvgAccuracy = g.Average(a => a.Accuracy),
                UniquePlayers = g.Select(a => a.ChildProfileId).Distinct().Count()
            })
            .ToDictionaryAsync(x => x.LevelId);

        var result = levels.Select(l =>
        {
            stats.TryGetValue(l.Id, out var s);
            var count = s?.Count ?? 0;
            var passed = s?.Passed ?? 0;
            decimal passRate = count == 0 ? 0m : Math.Round((decimal)passed * 100m / count, 1);
            decimal? avgWpm = s is null ? null : Math.Round(s.AvgWpm, 1);
            decimal? avgAcc = s is null ? null : Math.Round(s.AvgAccuracy, 1);

            return new AdminLevelStats(
                l.LevelNumber, l.Title, l.Phase,
                count, passed, passRate,
                avgWpm, avgAcc, s?.UniquePlayers ?? 0);
        }).ToList();

        return Ok(result);
    }

    [HttpGet("activity")]
    public async Task<IActionResult> GetActivity([FromQuery] int days = 30)
    {
        days = Math.Clamp(days, 1, 365);
        var start = DateTime.UtcNow.Date.AddDays(-days + 1);

        var attemptBuckets = await db.LevelAttempts
            .Where(a => a.CompletedAt >= start)
            .GroupBy(a => a.CompletedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Attempts = g.Count(),
                UniqueChildren = g.Select(a => a.ChildProfileId).Distinct().Count()
            })
            .ToListAsync();

        var parentBuckets = await db.Users
            .Where(u => u.CreatedAt >= start)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, NewParents = g.Count() })
            .ToListAsync();

        var points = new List<AdminActivityPoint>();
        for (var i = 0; i < days; i++)
        {
            var date = start.AddDays(i);
            var a = attemptBuckets.FirstOrDefault(x => x.Date == date);
            var p = parentBuckets.FirstOrDefault(x => x.Date == date);
            points.Add(new AdminActivityPoint(
                date,
                a?.Attempts ?? 0,
                a?.UniqueChildren ?? 0,
                p?.NewParents ?? 0));
        }

        return Ok(points);
    }

    [HttpGet("children/{id:guid}")]
    public async Task<IActionResult> GetChildDetail(Guid id)
    {
        var child = await db.ChildProfiles
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (child == null) return NotFound();

        var attempts = await db.LevelAttempts
            .Where(a => a.ChildProfileId == id)
            .Include(a => a.LevelDefinition)
            .OrderByDescending(a => a.CompletedAt)
            .Take(50)
            .Select(a => new AdminAttemptRow(
                a.Id,
                a.LevelDefinition.LevelNumber,
                a.LevelDefinition.Title,
                a.Wpm,
                a.Accuracy,
                a.HeartsRemaining,
                a.PointsAwarded,
                a.Passed,
                a.CompletedAt))
            .ToListAsync();

        var attemptCount = await db.LevelAttempts.CountAsync(a => a.ChildProfileId == id);
        var lastAttempt = await db.LevelAttempts
            .Where(a => a.ChildProfileId == id)
            .MaxAsync(a => (DateTime?)a.CompletedAt);
        var avgWpm = attemptCount == 0 ? (decimal?)null :
            Math.Round(await db.LevelAttempts.Where(a => a.ChildProfileId == id).AverageAsync(a => a.Wpm), 1);
        var avgAcc = attemptCount == 0 ? (decimal?)null :
            Math.Round(await db.LevelAttempts.Where(a => a.ChildProfileId == id).AverageAsync(a => a.Accuracy), 1);

        var row = new AdminChildRow(
            child.Id,
            child.DisplayName,
            child.CurrentStage.ToString(),
            child.TotalPoints,
            child.HighestLevelCompleted,
            attemptCount,
            lastAttempt,
            avgWpm,
            avgAcc,
            child.CreatedAt);

        return Ok(new AdminChildDetailResponse(row, child.Parent.Email ?? string.Empty, attempts));
    }
}
