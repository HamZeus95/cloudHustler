package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Expense;

import java.util.List;
import java.util.UUID;

public interface IExpense {
    Expense addExpense(Expense expense);
    Expense updateExpense(Expense expense);
    void deleteExpense(UUID idExpense);
    List<Expense> getAll();
    Expense getExpense(UUID idExpense);
}
