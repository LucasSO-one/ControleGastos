
public record CreateTransactionDto(
    string Description,
    decimal Amount,
    DateTime Date,
    int CategoryId,
    TransactionType Type // 0 - Expense, 1 - Income
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