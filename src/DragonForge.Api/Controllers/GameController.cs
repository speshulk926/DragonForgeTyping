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

    private async Task<EvolutionStage> ComputeStage(ChildProfile child)
    {
        if (child.HighestLevelCompleted < 5) return EvolutionStage.Egg;

        var passed = await db.LevelAttempts
            .Where(a => a.ChildProfileId == child.Id && a.Passed)
            .OrderByDescending(a => a.CompletedAt)
            .ToListAsync();

        // Only count top 5 distinct levels
        var topLevels = passed
            .Select(a => a.LevelDefinitionId)
            .Distinct()
            .Take(5)
            .ToHashSet();

        var relevant = passed.Where(a => topLevels.Contains(a.LevelDefinitionId)).Take(10).ToList();

        if (relevant.Count >= 10)
        {
            var avgWpm = relevant.Average(a => (double)a.Wpm);
            var avgAcc = relevant.Average(a => (double)a.Accuracy);

            if (avgWpm >= 90 && avgAcc >= 95) return EvolutionStage.InfernoDragon;
            if (avgWpm >= 70 && avgAcc >= 95) return EvolutionStage.ElderDragon;
            if (avgWpm >= 50 && avgAcc >= 95) return EvolutionStage.FireDrake;
            if (avgWpm >= 30 && avgAcc >= 95) return EvolutionStage.YoungDragon;
            if (avgWpm >= 20 && avgAcc >= 95) return EvolutionStage.Drake;
        }

        return EvolutionStage.Hatchling;
    }
}
