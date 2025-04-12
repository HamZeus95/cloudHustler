package cloud.hustler.pidevbackend.controllers;

import cloud.hustler.pidevbackend.entity.Task;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import cloud.hustler.pidevbackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;




    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.addTask(task);
        return ResponseEntity.status(201).body(createdTask);
    }

    @PutMapping("/updateStatus/{taskId}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable UUID taskId, @RequestBody TypeStatus status) {
        Task updatedTask = taskService.updateTaskStatus(taskId, status);
        return updatedTask != null ? ResponseEntity.ok(updatedTask) : ResponseEntity.notFound().build();
    }
    @PostMapping("/add")
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        Task createdTask = taskService.addTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
