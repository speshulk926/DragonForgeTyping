using DragonForge.Api.Data;
using DragonForge.Api.Middleware;
using DragonForge.Api.Models.DTOs;
using DragonForge.Api.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Controllers;

[ApiController]
[Route("api/game")]
public class GameController(AppDbContext db) : ControllerBase
{
    private ChildProfile? Child => HttpContext.GetChildProfile();

    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        if (Child == null) return Unauthorized(new { error = "Invalid session" });
        return Ok(new GameProfileResponse(
            Child.Id, Child.DisplayName, Child.CurrentStage.ToString(),
            Child.TotalPoints, Child.HighestLevelCompleted));
    }

    [HttpPost("attempt")]
    public async Task<IActionResult> SubmitAttempt([FromBody] SubmitAttemptRequest req)
    {
        if (Child == null) return Unauthorized(new { error = "Invalid session" });

        var level = await db.LevelDefinitions
            .FirstOrDefaultAsync(l => l.LevelNumber == req.LevelNumber);
        if (level == null) return BadRequest(new { error = "Level not found" });

        var attempt = new LevelAttempt
        {
            ChildProfileId = Child.Id,
            LevelDefinitionId = level.Id,
            StartedAt = DateTime.UtcNow.AddSeconds(-30), // approximate
            CompletedAt = DateTime.UtcNow,
            Wpm = req.Wpm,
            Accuracy = req.Accuracy,
            HeartsRemaining = req.HeartsRemaining,
            PointsAwarded = req.PointsAwarded,
            Passed = req.Passed
        };
        db.LevelAttempts.Add(attempt);

        // Update child profile
        var child = await db.ChildProfiles.FindAsync(Child.Id);
        if (child != null)
        {
            child.TotalPoints += req.PointsAwarded;
            if (req.Passed && req.LevelNumber > child.HighestLevelCompleted)
                child.HighestLevelCompleted = req.LevelNumber;

            // Check evolution
            var newStage = await ComputeStage(child);
            if (newStage > child.CurrentStage)
                child.CurrentStage = newStage;

            child.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();

        return Ok(new
        {
            attempt.Id,
            req.PointsAwarded,
            Stage = child?.CurrentStage.ToString() ?? Child.CurrentStage.ToString(),
            child?.TotalPoints,
            child?.HighestLevelCompleted
        });
    }

    [HttpGet("evolution")]
    public async Task<IActionResult> GetEvolution()
    {
        if (Child == null) return Unauthorized(new { error = "Invalid session" });

        var child = await db.ChildProfiles.FindAsync(Child.Id);
        if (child == null) return NotFound();

        var nextStage = child.CurrentStage < EvolutionStage.InfernoDragon
            ? child.CurrentStage + 1
            : (EvolutionStage?)null;

        return Ok(new
        {
            CurrentStage = child.CurrentStage.ToString(),
            NextStage = nextStage?.ToString(),
            child.TotalPoints,
            child.HighestLevelCompleted
        });
    }

    // Stage requirements: (minPasses, minWpm, minAccuracy)
    private static readonly (EvolutionStage Stage, int MinPasses, double? MinWpm, double? MinAcc)[] StageReqs =
    [
        (EvolutionStage.InfernoDragon, 70, 90, 95),
        (EvolutionStage.ElderDragon,   45, 70, 95),
        (EvolutionStage.FireDrake,     30, 50, 95),
        (EvolutionStage.YoungDragon,   20, 30, 95),
        (EvolutionStage.Drake,         10, 20, 95),
        (EvolutionStage.Hatchling,      5, null, null),
    ];

    private async Task<EvolutionStage> ComputeStage(ChildProfile child)
    {
        var passed = await db.LevelAttempts
            .Where(a => a.ChildProfileId == child.Id && a.Passed)
            .OrderByDescending(a => a.CompletedAt)
            .ToListAsync();

        var totalPasses = passed.Count;

        // Top 5 distinct levels for WPM/accuracy averaging
        var topLevels = passed
            .Select(a => a.LevelDefinitionId).Distinct()
            .Take(5).ToHashSet();
        var relevant = passed.Where(a => topLevels.Contains(a.LevelDefinitionId)).Take(10).ToList();
        var avgWpm = relevant.Count >= 10 ? relevant.Average(a => (double)a.Wpm) : 0;
        var avgAcc = relevant.Count >= 10 ? relevant.Average(a => (double)a.Accuracy) : 0;

        foreach (var req in StageReqs)
        {
            if (totalPasses < req.MinPasses) continue;
            if (req.MinWpm == null) // Hatchling — just needs passes + levels
            {
                if (child.HighestLevelCompleted >= req.MinPasses) return req.Stage;
                continue;
            }
            if (relevant.Count >= 10 && avgWpm >= req.MinWpm && avgAcc >= req.MinAcc)
                return req.Stage;
        }

        return EvolutionStage.Egg;
    }
}
