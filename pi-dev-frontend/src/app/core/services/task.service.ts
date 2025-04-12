import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/famrs/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8090/pidb/task'; // Your backend URL

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    console.log('Getting tasks...');
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);

  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/add`, task);
  }

  updateTaskStatus(uuid_task: string, status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/update-status/${uuid_task}`, { status });
  }

  deleteTask(uuid_task: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid_task}`);
  }
}
