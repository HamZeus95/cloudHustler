import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/core/models/famrs/task';
import { TaskService } from 'src/app/core/services/farm-managment/task.service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
})
export class TaskManagementComponent implements OnInit {
  toDoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  selectedTask: Task | null = null;
  isModalOpen = false;
  newTask: Omit<Task, 'uuid_task'> = {
    title: '',
    description: '',
    status: 'TO_DO',
    startDate: null,
    endDate: null,
    farm: null // Will be set based on context (e.g., selected farm)
  };

  // Mock farm for demo; replace with actual farm selection logic
  selectedFarm: any = { id: 'farm-1', name: 'Sample Farm' };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.toDoTasks = tasks.filter(t => t.status === 'TO_DO');
        this.inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
        this.doneTasks = tasks.filter(t => t.status === 'DONE');
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        alert('Failed to load tasks. Please try again.');
      }
    });
  }

  openAddTaskModal(status: Task['status']): void {
    this.newTask = {
      title: '',
      description: '',
      status,
      startDate: null,
      endDate: null,
      farm: this.selectedFarm // Assign selected farm
    };
    this.selectedTask = null;
    this.isModalOpen = true;
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = { ...task };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTask = null;
    this.newTask = {
      title: '',
      description: '',
      status: 'TO_DO',
      startDate: null,
      endDate: null,
      farm: this.selectedFarm
    };
  }

  saveTask(): void {
    if (this.selectedTask) {
      // Edit existing task (only update status for simplicity; extend for other fields if needed)
      this.taskService.updateTaskStatus(this.selectedTask.uuid_task!, this.selectedTask.status).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating task:', err);
          alert('Failed to update task. Please try again.');
        }
      });
    } else {
      // Add new task
      this.taskService.addTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding task:', err);
          alert('Failed to add task. Please try again.');
        }
      });
    }
  }

  deleteTask(uuid_task: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(uuid_task).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          alert('Failed to delete task. Please try again.');
        }
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move to a different column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status
      const movedTask = event.container.data[event.currentIndex];
      const newStatus = event.container.id as Task['status'];
      this.taskService.updateTaskStatus(movedTask.uuid_task!, newStatus).subscribe({
        next: () => {
          this.loadTasks(); // Refresh to sync with backend
        },
        error: (err) => {
          console.error('Error updating task status:', err);
          alert('Failed to update task status. Please try again.');
          // Revert UI change on error
          this.loadTasks();
        }
      });
    }
  }

  getFieldValue(field: keyof Task): any {
    if (field === 'uuid_task') {
      return this.selectedTask ? this.selectedTask[field] : undefined;
    }
    return this.selectedTask ? this.selectedTask[field] : this.newTask[field as keyof Omit<Task, 'uuid_task'>];
  }
  
  setFieldValue(field: keyof Task, value: any): void {
    if (this.selectedTask) {
      this.selectedTask[field] = value;
    } else {
      this.newTask[field as keyof Omit<Task, 'uuid_task'>] = value;
    }
  }
  
  getFarmName(): string {
    return this.selectedTask?.farm?.name ?? this.newTask.farm?.name ?? '';
  }
  
}
