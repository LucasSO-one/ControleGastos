public record CreateTransactionDto(
    string description,
    decimal amount,
    DateTime date,
    int CategoryId,
    TransactionType type // 0 - Expense, 1 - Income
);

public record UpdateTransactionDto(
    string Description, 
    decimal Amount, 
    DateTime Date, 
    int CategoryId, 
    TransactionType Type
);

// DTO para o Dashboard (Resumo financeiro)
public record DashboardResponseDto(
    decimal TotalIncome, 
    decimal TotalExpense, 
    decimal Balance
);