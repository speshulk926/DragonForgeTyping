using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DragonForge.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace DragonForge.Api.Services;

public class AuthService(
    UserManager<Parent> userManager,
    IConfiguration config)
{
    public async Task<(bool Success, string? Token, Parent? User, string? Error)> RegisterAsync(
        string email, string password, string displayName)
    {
        var user = new Parent
        {
            UserName = email,
            Email = email,
            DisplayName = displayName
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return (false, null, null, string.Join("; ", result.Errors.Select(e => e.Description)));

        var token = GenerateJwt(user);
        return (true, token, user, null);
    }

    public async Task<(bool Success, string? Token, Parent? User, string? Error)> LoginAsync(
        string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
            return (false, null, null, "Invalid email or password");

        var valid = await userManager.CheckPasswordAsync(user, password);
        if (!valid)
            return (false, null, null, "Invalid email or password");

        var token = GenerateJwt(user);
        return (true, token, user, null);
    }

    private string GenerateJwt(Parent user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim("displayName", user.DisplayName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var expMinutes = int.Parse(config["Jwt:ExpirationInMinutes"] ?? "1440");
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string GenerateSessionToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }

    public static string HashToken(string token)
    {
        return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }
}
