using DragonForge.Api.Data;
using DragonForge.Api.Models.Entities;
using DragonForge.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace DragonForge.Api.Middleware;

public class ChildSessionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        if (context.Request.Path.StartsWithSegments("/api/game"))
        {
            var header = context.Request.Headers["X-Child-Session"].FirstOrDefault();
            if (!string.IsNullOrEmpty(header))
            {
                var hash = AuthService.HashToken(header);
                var session = await db.DeviceSessions
                    .Include(s => s.ChildProfile)
                    .FirstOrDefaultAsync(s =>
                        s.TokenHash == hash &&
                        s.RevokedAt == null &&
                        s.ExpiresAt > DateTime.UtcNow);

                if (session != null)
                {
                    context.Items["ChildProfile"] = session.ChildProfile;
                    context.Items["DeviceSession"] = session;
                }
            }
        }

        await next(context);
    }
}

public static class ChildSessionExtensions
{
    public static ChildProfile? GetChildProfile(this HttpContext context)
    {
        return context.Items["ChildProfile"] as ChildProfile;
    }
}
