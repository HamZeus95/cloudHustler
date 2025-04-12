package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Task;
import cloud.hustler.pidevbackend.entity.TypeStatus;
import cloud.hustler.pidevbackend.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;



@Service
@AllArgsConstructor
public class TaskService implements ITask {

    @Autowired
    private TaskRepository taskRepository;


    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task getTaskById(UUID taskId) {
        return taskRepository.findById(taskId).orElse(null);
    }

    @Override
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }

    @Override
    public Task updateTaskStatus(UUID taskId, TypeStatus status) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        return null;
    }
}