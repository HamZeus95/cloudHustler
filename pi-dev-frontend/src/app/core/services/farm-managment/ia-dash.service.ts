import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class IaDashService {
  
    constructor(private http: HttpClient) { }

  recommendCrop(data: any): Observable<any> {
    return this.http.post('/api/v1/ia-farm/recommend-crop', data);  // Adjusted URL
  }

  askFarmingQuestion(prompt: string): Observable<any> {
    return this.http.post('/api/v1/ia-farm/ask-farming-question', { prompt });  // Adjusted URL
  }
  }
  
