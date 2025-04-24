package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.entity.Expense;

import java.util.List;
import java.util.UUID;

public interface IExpense {
    Expense addExpense(Expense resource, UUID idFarm);
    Expense updateExpense(Expense resource);
    void deleteExpense(UUID idExpense);
    List<Expense> getAll();
    Expense getExpense(UUID idExpense);
}
