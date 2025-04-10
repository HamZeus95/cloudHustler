import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from 'src/app/core/models/livraison/livraison';

@Injectable({ providedIn: 'root' })
export class LivraisonService {
  private baseUrl = 'http://localhost:8090/tpfoyer/livraisons';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.baseUrl);
  }

  getById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.baseUrl}/${id}`);
  }

  create(data: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(this.baseUrl, data);
  }

  update(id: number, data: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
