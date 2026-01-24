using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        return Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? month, [FromQuery] int? year)
    {
        var userId = GetUserId();
        var query = _context.Transactions.Include(t => t.Category)
        .Where(t => t.UserId == userId);

        if(month.HasValue && year.HasValue)
        {
            query = query.Where(t => t.Date.Month == month && t.Date.Year == year);
        }

        var transactions = await query.OrderByDescending(t => t.Date).ToListAsync();
        return Ok(transactions);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardData()
    {
        
    }
}