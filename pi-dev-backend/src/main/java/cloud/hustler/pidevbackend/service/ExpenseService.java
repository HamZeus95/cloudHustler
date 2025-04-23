package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.entity.Farm;
import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.repository.ExpenseRepository;
import cloud.hustler.pidevbackend.repository.FarmRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ExpenseService implements IExpense{

    @Autowired
    private ExpenseRepository expenseRepository;
    private FarmRepository farmRepository;


    @Override
    public Expense addExpense(Expense expense, UUID idFarm) {
        Farm farm = farmRepository.findById(idFarm).get();
        farm.addExpense(expense);
        expense.setFarm(farm);
        return expenseRepository.save(expense);
    }

    @Override
    public Expense updateExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public void deleteExpense(UUID idExpense) {
        expenseRepository.deleteById(idExpense);
    }

    @Override
    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    @Override
    public Expense getExpense(UUID idExpense) {
        return expenseRepository.findById(idExpense).orElse(null);
    }

}
