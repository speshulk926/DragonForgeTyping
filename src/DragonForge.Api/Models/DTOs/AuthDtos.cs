namespace DragonForge.Api.Models.DTOs;

public record RegisterRequest(string Email, string Password, string DisplayName);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string DisplayName, Guid UserId);

public record GenerateOtpRequest(Guid ChildId);
public record OtpResponse(string Code, DateTime ExpiresAt);
public record ChildLoginRequest(string Code);
public record ChildLoginResponse(string SessionToken, Guid ChildId, string DisplayName);
