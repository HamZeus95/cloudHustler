package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Expense;
import cloud.hustler.pidevbackend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> expenses() {
        List<Expense> expenses = expenseService.getAll();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/expense/{id}")
    public ResponseEntity<Expense> expense(@PathVariable UUID id) {
        Expense expense = expenseService.getExpense(id);
        if (expense != null) {
            return ResponseEntity.ok(expense);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add/{idFarm}")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense,@PathVariable UUID idFarm) {
        Expense createdExpense = expenseService.addExpense(expense,idFarm);
        return ResponseEntity.status(201).body(createdExpense);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<Expense> updateExpense(@RequestBody Expense expense) {
        Expense updatedExpense = expenseService.updateExpense(expense);
        if (updatedExpense != null) {
            return ResponseEntity.ok(updatedExpense);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
