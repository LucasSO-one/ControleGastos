using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User User)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"] ?? Environment.GetEnvironmentVariable("JwtSettings__SecretKey");
        var issuer = _configuration["JwtSettings:Issuer"] ?? Environment.GetEnvironmentVariable("JwtSettings__Issuer");
        var audience = _configuration["JwtSettings:Audience"] ?? Environment.GetEnvironmentVariable("JwtSettings__Audience");
        var expiresHours = _configuration["JwtSettings:ExpiresHours"] ?? Environment.GetEnvironmentVariable("JwtSettings__ExpiresHours");

        // Validação de segurança básica para não quebrar se faltar algo
        if (string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience) || string.IsNullOrEmpty(expiresHours))
        {
            throw new Exception("Configurações do JWT (Secret, Issuer, Audience ou Expires) estão faltando nas variáveis de ambiente.");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, User.Id.ToString()),
            new Claim(ClaimTypes.Name, User.Name),
            new Claim(ClaimTypes.Email, User.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,       
            audience: audience,  
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(expiresHours)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}