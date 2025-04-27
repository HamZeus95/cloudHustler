import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Expense } from '../../models/famrs/expense';


@Injectable()
export class ExpenseService {
  private apiUrl ='/api/v1/expense'; 

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/expense/${id}`);
  }

  addExpense(expense: Expense, idFarm: string): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/add/${idFarm}`, expense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/update`, expense);
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
