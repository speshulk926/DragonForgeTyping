using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;

namespace DragonForge.Api.Middleware;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminKeyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var expected = config["Admin:Key"];

        if (string.IsNullOrEmpty(expected))
        {
            context.Result = new ObjectResult("Admin key is not configured on the server.")
            {
                StatusCode = StatusCodes.Status503ServiceUnavailable
            };
            return;
        }

        if (!context.HttpContext.Request.Headers.TryGetValue("X-Admin-Key", out var provided)
            || !string.Equals(provided.ToString(), expected, StringComparison.Ordinal))
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
