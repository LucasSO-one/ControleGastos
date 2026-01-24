using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Transaction
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Description { get; set; }

    [Column(TypeName = "decimal(18,2)")] // Precisão monetária
    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    // Campos de Auditoria da IA
    public InputMethod InputMethod { get; set; }
    
    [Column(TypeName = "jsonb")] // Recurso nativo do Postgres
    public string? AiAnalysisJson { get; set; }

    public TransactionType Type { get; set; }

    // Chaves Estrangeiras
    public Guid UserId { get; set; }
    public User User { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

public enum InputMethod { Manual, AiText, AiImage }

public enum TransactionType { Expense = 0, Income = 1}