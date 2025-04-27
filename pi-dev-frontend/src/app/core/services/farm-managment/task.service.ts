import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../models/famrs/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl+'task'; 

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    console.log('Getting tasks...');
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);

  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/add`, task);
  }

  updateTaskStatus(uuid_task: string, status: 'TO_DO' | 'IN_PROGRESS' | 'DONE'): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.patch<Task>(
      `${this.apiUrl}/${uuid_task}/status`,
      JSON.stringify(status), // Send status as raw string, e.g., "IN_PROGRESS"
      { headers }
    );
  }
  deleteTask(uuid_task: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${uuid_task}`);
  }
}
