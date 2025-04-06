import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Farm } from 'src/app/core/modules/farm';


@Injectable()
export class FarmService {
  private apiUrl = 'http://localhost:8090/pidb/farm'; 

  constructor(private http: HttpClient) {}

  getFarms(): Observable<Farm[]> {
    return this.http.get<Farm[]>(`${this.apiUrl}/farms`);
  }
    

  getFarmById(id: string): Observable<Farm> {
    return this.http.get<Farm>(`${this.apiUrl}/farm/${id}`);
  }

  addFarm(farm: Farm): Observable<Farm> {
    return this.http.post<Farm>(`${this.apiUrl}/add`, farm);
  }

  updateFarm(farm: Farm): Observable<Farm> {
    return this.http.put<Farm>(`${this.apiUrl}/update`, farm);
  }

  deleteFarm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
