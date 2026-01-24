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
    public async Task<IActionResult> GetDashboard([FromQuery] int? month, [FromQuery] int? year)
    {
        var userId = GetUserId();

        // Se o usuário não mandou mês/ano, usamos a data atual
        int targetMonth = month ?? DateTime.Now.Month;
        int targetYear = year ?? DateTime.Now.Year;

        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId && 
                        t.Date.Month == targetMonth && 
                        t.Date.Year == targetYear)
            .ToListAsync();

        var income = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
        var expense = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

        return Ok(new DashboardResponseDto(income, expense, income - expense));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        var userId = GetUserId();

        var transaction = new Transaction
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Date = dto.Date,
            CategoryId = dto.CategoryId,
            Type = dto.Type,
            UserId = userId,
            InputMethod = InputMethod.Manual
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), null, transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update (Guid id, [FromBody] UpdateTransactionDto dto)
    {
        var userId = GetUserId();

        var transaction = await _context.Transactions
        .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null) return NotFound("Transação não encontrada.");

        // Atualiza os campos
        transaction.Description = dto.Description;
        transaction.Amount = dto.Amount;
        transaction.Date = dto.Date;
        transaction.CategoryId = dto.CategoryId;
        transaction.Type = dto.Type;

        await _context.SaveChangesAsync();
        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete (Guid id)
    {
        var userId = GetUserId();

        var transaction = await _context.Transactions
        .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null) return NotFound();

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}