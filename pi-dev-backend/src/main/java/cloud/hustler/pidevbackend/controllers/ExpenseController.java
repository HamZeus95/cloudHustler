package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.service.CropService;
import cloud.hustler.pidevbackend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/expenses")
    public List<Expense> expenses(){
        return expenseService.getAll();
    }
    @GetMapping("/expense/{id}")
    public Expense expense(@PathVariable UUID id){
        return expenseService.getExpense(id);
    }
    @PostMapping("/add")
    public Expense addExpense(@RequestBody Expense expense){
        return expenseService.addExpense(expense);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteExpense(@PathVariable UUID id){
        expenseService.deleteExpense(id);
    }
    @PutMapping("/update")
    public Expense updateExpense(@RequestBody Expense expense){
        return expenseService.updateExpense(expense);
    }

}
