using DragonForge.Api.Data;
using DragonForge.Api.Models.DTOs;
using DragonForge.Api.Models.Entities;
using DragonForge.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService auth, AppDbContext db) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var (success, token, user, error) = await auth.RegisterAsync(req.Email, req.Password, req.DisplayName);
        if (!success) return BadRequest(new { error });
        return Ok(new AuthResponse(token!, user!.DisplayName, user.Id));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var (success, token, user, error) = await auth.LoginAsync(req.Email, req.Password);
        if (!success) return Unauthorized(new { error });
        return Ok(new AuthResponse(token!, user!.DisplayName, user.Id));
    }

    [HttpPost("child-code")]
    [Authorize]
    public async Task<IActionResult> GenerateChildCode([FromBody] GenerateOtpRequest req)
    {
        var parentId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var child = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.Id == req.ChildId && c.ParentId == parentId);

        if (child == null) return NotFound(new { error = "Child not found" });

        // Invalidate any existing unused OTPs
        var existing = await db.ChildOtps
            .Where(o => o.ChildProfileId == child.Id && !o.Used && o.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
        foreach (var o in existing) o.Used = true;

        var code = Random.Shared.Next(100000, 999999).ToString();
        var otp = new ChildOtp
        {
            ChildProfileId = child.Id,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5)
        };
        db.ChildOtps.Add(otp);
        await db.SaveChangesAsync();

        return Ok(new OtpResponse(code, otp.ExpiresAt));
    }

    [HttpPost("child-login")]
    public async Task<IActionResult> ChildLogin([FromBody] ChildLoginRequest req)
    {
        var otp = await db.ChildOtps
            .Include(o => o.ChildProfile)
            .FirstOrDefaultAsync(o =>
                o.Code == req.Code &&
                !o.Used &&
                o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return Unauthorized(new { error = "Invalid or expired code" });

        otp.Used = true;

        // Create session token
        var rawToken = AuthService.GenerateSessionToken();
        var session = new DeviceSession
        {
            ChildProfileId = otp.ChildProfileId,
            TokenHash = AuthService.HashToken(rawToken),
            DeviceName = Request.Headers.UserAgent.FirstOrDefault(),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };
        db.DeviceSessions.Add(session);
        await db.SaveChangesAsync();

        return Ok(new ChildLoginResponse(rawToken, otp.ChildProfileId, otp.ChildProfile.DisplayName));
    }

    [HttpPost("parent-play")]
    [Authorize]
    public async Task<IActionResult> ParentPlay()
    {
        var parentId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var parent = await db.Users.FindAsync(parentId);
        if (parent == null) return Unauthorized();

        // Find or create the parent's own game profile
        var selfProfile = await db.ChildProfiles
            .FirstOrDefaultAsync(c => c.ParentId == parentId && c.DisplayName == parent.DisplayName && c.AvatarChoice == "__parent_self__");

        if (selfProfile == null)
        {
            selfProfile = new ChildProfile
            {
                ParentId = parentId,
                DisplayName = parent.DisplayName,
                AvatarChoice = "__parent_self__"
            };
            db.ChildProfiles.Add(selfProfile);
            await db.SaveChangesAsync();
        }

        // Create a session token
        var rawToken = AuthService.GenerateSessionToken();
        var session = new DeviceSession
        {
            ChildProfileId = selfProfile.Id,
            TokenHash = AuthService.HashToken(rawToken),
            DeviceName = Request.Headers.UserAgent.FirstOrDefault(),
            ExpiresAt = DateTime.UtcNow.AddDays(30)
        };
        db.DeviceSessions.Add(session);
        await db.SaveChangesAsync();

        return Ok(new ChildLoginResponse(rawToken, selfProfile.Id, selfProfile.DisplayName));
    }

    [HttpPost("child-logout")]
    public async Task<IActionResult> ChildLogout()
    {
        var header = Request.Headers["X-Child-Session"].FirstOrDefault();
        if (string.IsNullOrEmpty(header)) return BadRequest();

        var hash = AuthService.HashToken(header);
        var session = await db.DeviceSessions
            .FirstOrDefaultAsync(s => s.TokenHash == hash && s.RevokedAt == null);

        if (session != null)
        {
            session.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        return Ok();
    }
}
