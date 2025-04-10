package cloud.hustler.pidevbackend.controllers;


import cloud.hustler.pidevbackend.entity.Crop;
import cloud.hustler.pidevbackend.entity.Task;
import cloud.hustler.pidevbackend.service.CropService;
import cloud.hustler.pidevbackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/task")
public class taskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/tasks")
    public List<Task> tasks(){
        return taskService.getAll();
    }
    @GetMapping("/task/{id}")
    public Task task(@PathVariable UUID id){
        return taskService.getTask(id);
    }
    @PostMapping("/add")
    public Task addTask(@RequestBody Task task){
        return taskService.addTask(task);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable UUID id){
        taskService.deleteTask(id);
    }
    @PutMapping("/update")
    public Task updateTask(@RequestBody Task task){
        return taskService.updateTask(task);
    }


}
