using DragonForge.Api.Data;
using DragonForge.Api.Models.DTOs;
using DragonForge.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Controllers;

[ApiController]
[Route("api/children")]
[Authorize]
public class ChildrenController(AppDbContext db) : ControllerBase
{
    private Guid ParentId => Guid.Parse(User.FindFirst("sub")!.Value);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var children = await db.ChildProfiles
            .Where(c => c.ParentId == ParentId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new ChildResponse(
                c.Id, c.DisplayName, c.AvatarChoice,
                c.CurrentStage.ToString(), c.TotalPoints,
                c.HighestLevelCompleted, c.CreatedAt))
            .ToListAsync();
        return Ok(children);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateChildRequest req)
    {
        var child = new ChildProfile
        {
            ParentId = ParentId,
            DisplayName = req.DisplayName,
            AvatarChoice = req.AvatarChoice
        };
        db.ChildProfiles.Add(child);
        await db.SaveChangesAsync();

        return Ok(new ChildResponse(
            child.Id, child.DisplayName, child.AvatarChoice,
            child.CurrentStage.ToString(), child.TotalPoints,
            child.HighestLevelCompleted, child.CreatedAt));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateChildRequest req)
    {
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == id && c.ParentId == ParentId);
        if (child == null) return NotFound();

        child.DisplayName = req.DisplayName;
        child.AvatarChoice = req.AvatarChoice;
        child.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(new ChildResponse(
            child.Id, child.DisplayName, child.AvatarChoice,
            child.CurrentStage.ToString(), child.TotalPoints,
            child.HighestLevelCompleted, child.CreatedAt));
    }

    [HttpGet("{id:guid}/progress")]
    public async Task<IActionResult> GetProgress(Guid id)
    {
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == id && c.ParentId == ParentId);
        if (child == null) return NotFound();

        return Ok(new GameProfileResponse(
            child.Id, child.DisplayName, child.CurrentStage.ToString(),
            child.TotalPoints, child.HighestLevelCompleted));
    }

    [HttpGet("{id:guid}/attempts")]
    public async Task<IActionResult> GetAttempts(Guid id)
    {
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == id && c.ParentId == ParentId);
        if (child == null) return NotFound();

        var attempts = await db.LevelAttempts
            .Where(a => a.ChildProfileId == id)
            .Include(a => a.LevelDefinition)
            .OrderByDescending(a => a.CompletedAt)
            .Select(a => new AttemptResponse(
                a.Id, a.LevelDefinition.LevelNumber, a.LevelDefinition.Title,
                a.Wpm, a.Accuracy, a.HeartsRemaining,
                a.PointsAwarded, a.Passed, a.CompletedAt))
            .ToListAsync();
        return Ok(attempts);
    }

    [HttpGet("{id:guid}/sessions")]
    public async Task<IActionResult> GetSessions(Guid id)
    {
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == id && c.ParentId == ParentId);
        if (child == null) return NotFound();

        var sessions = await db.DeviceSessions
            .Where(s => s.ChildProfileId == id && s.RevokedAt == null && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new { s.Id, s.DeviceName, s.CreatedAt, s.ExpiresAt })
            .ToListAsync();
        return Ok(sessions);
    }

    [HttpDelete("{childId:guid}/sessions/{sessionId:guid}")]
    public async Task<IActionResult> RevokeSession(Guid childId, Guid sessionId)
    {
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == childId && c.ParentId == ParentId);
        if (child == null) return NotFound();

        var session = await db.DeviceSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.ChildProfileId == childId);
        if (session == null) return NotFound();

        session.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok();
    }
}
