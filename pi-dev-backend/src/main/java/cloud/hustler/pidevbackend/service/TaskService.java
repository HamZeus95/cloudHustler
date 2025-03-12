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
        return null;
    }

    @Override
    public Task updateTask(Task task) {
        return null;
    }

    @Override
    public void deleteTask(long idTask) {

    }

    @Override
    public List<Task> getAll() {
        return List.of();
    }

    @Override
    public Task getTask(long idTask) {
        return null;
    }
}
