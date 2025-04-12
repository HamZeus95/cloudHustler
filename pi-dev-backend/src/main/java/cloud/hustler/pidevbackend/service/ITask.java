package cloud.hustler.pidevbackend.service;


import cloud.hustler.pidevbackend.entity.Task;
import cloud.hustler.pidevbackend.entity.TypeStatus;

import java.util.List;
import java.util.UUID;

public interface ITask {

    Task addTask(Task task);
    Task updateTask(Task task);
    void deleteTask(UUID idTask);
    List<Task> getAllTasks();
    Task getTaskById(UUID idTask);
    Task updateTaskStatus(UUID taskId, TypeStatus status);
}
