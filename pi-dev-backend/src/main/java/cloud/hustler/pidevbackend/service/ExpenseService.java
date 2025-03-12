package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.repository.ExpenseRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExpenseService implements IExpense{

    @Autowired
    private ExpenseRepository expenseRepository;

    @Override
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public Expense updateExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public void deleteExpense(long idExpense) {
        expenseRepository.deleteById(idExpense);

    }

    @Override
    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    @Override
    public Expense getExpense(long idExpense) {
        return expenseRepository.findById(idExpense).get();
    }
}
