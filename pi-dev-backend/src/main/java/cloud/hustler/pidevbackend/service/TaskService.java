package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.Task;
import cloud.hustler.pidevbackend.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskService implements ITask{
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(long idTask) {
        taskRepository.deleteById(idTask);

    }

    @Override
    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    @Override
    public Task getTask(long idTask) {
        return taskRepository.findById(idTask).get();
    }
}
