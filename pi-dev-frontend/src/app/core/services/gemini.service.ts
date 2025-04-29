import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly apiUrl = 'http://localhost:8090/api/v1/gemini/chat';

  constructor(private http: HttpClient) { }

  askGemini(prompt: string): Observable<{response?: string, error?: string}> {
    return this.http.post<{response: string}>(
      this.apiUrl,
      { prompt },
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => ({
          error: error.message || 'Unknown error'
        }));
      })
    );
  }
}