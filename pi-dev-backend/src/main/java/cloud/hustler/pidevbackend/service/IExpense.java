package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Expense;

import java.util.List;

public interface IExpense {
    Expense addExpense(Expense expense);
    Expense updateExpense(Expense expense);
    void deleteExpense(long idExpense);
    List<Expense> getAll();
    Expense getExpense(long idExpense);
}
