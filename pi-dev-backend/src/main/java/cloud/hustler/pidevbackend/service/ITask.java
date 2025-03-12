package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Task;

import java.util.List;

public interface ITask {
    Task addTask(Task task);
    Task updateTask(Task task);
    void deleteTask(long idTask);
    List<Task> getAll();
    Task getTask(long idTask);



}
