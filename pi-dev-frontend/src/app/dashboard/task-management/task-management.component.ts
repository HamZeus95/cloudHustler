import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/core/models/famrs/task';
import { TaskService } from 'src/app/core/services/task.service';


@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
})
export class TaskManagementComponent implements OnInit {
  
  tasks: Task[] = [];
  tasksByStatus: { [key: string]: Task[] } = {};
  columns = {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  // Boolean flag to control form visibility
  showAddTaskForm: boolean = false;

  // Initialize newTask with default values (null for dates, empty string for title and description)
  newTask: Task = {
    title: '',
    description: '',
    status: 'TO_DO',
    startDate: null,
    endDate: null,
    farm: null,  // Assuming farm is set later or is optional
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks || [];
        this.filterTasksByStatus();
      },
      (error) => {
        console.error('Error loading tasks', error);
      }
    );
  }

  filterTasksByStatus(): void {
    this.tasksByStatus = {
      TO_DO: this.tasks.filter(task => task.status === 'TO_DO'),
      IN_PROGRESS: this.tasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: this.tasks.filter(task => task.status === 'DONE'),
    };
  }

  onTaskStatusChange(task: Task, status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'): void {
    this.taskService.updateTaskStatus(task.uuid_task!, status).subscribe(() => {
      task.status = status;
      this.filterTasksByStatus();
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.uuid_task!).subscribe(() => {
      this.loadTasks(); // Refresh tasks after deletion
    });
  }

  // Add task method
  addTask(): void {
    if (this.newTask.title && this.newTask.description && this.newTask.startDate && this.newTask.endDate) {
      this.taskService.addTask(this.newTask).subscribe((createdTask) => {
        this.tasks.push(createdTask);
        this.filterTasksByStatus();
        this.resetNewTask(); // Reset the form
        this.showAddTaskForm = false; // Hide form after adding task
      }, (error) => {
        console.error('Error adding task', error);
      });
    }
  }

  resetNewTask(): void {
    this.newTask = {
      title: '',
      description: '',
      status: 'TO_DO',
      startDate: null,
      endDate: null,
      farm: null,
    };
  }

  // Show the add task form
  toggleAddTaskForm(): void {
    this.showAddTaskForm = !this.showAddTaskForm;
  }
}
