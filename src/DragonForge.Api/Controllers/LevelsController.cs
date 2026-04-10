using DragonForge.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LevelsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var levels = await db.LevelDefinitions
            .OrderBy(l => l.LevelNumber)
            .Select(l => new
            {
                l.Id,
                l.LevelNumber,
                l.Title,
                l.Description,
                l.Phase,
                l.BasePoints,
                PromptCount = l.PromptTexts.Count
            })
            .ToListAsync();
        return Ok(levels);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var level = await db.LevelDefinitions.FindAsync(id);
        if (level is null) return NotFound();
        return Ok(level);
    }
}
