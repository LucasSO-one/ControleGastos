using System.ComponentModel.DataAnnotations;

public class Category
{
    [Key]
    public int Id { get; set; } 

    [Required]
    public string Name { get; set; } // "Alimentação", "Lazer"

    public string Icon { get; set; } 

    public CategoryType Type { get; set; } // Enum: 0 = Expense, 1 = Income

    // Se UserId for nulo, é uma categoria padrão do sistema.
    // Se tiver ID, é uma categoria personalizada criada pelo usuário.
    public Guid? UserId { get; set; } 
    public User? User { get; set; }
}

public enum CategoryType { Expense, Income }