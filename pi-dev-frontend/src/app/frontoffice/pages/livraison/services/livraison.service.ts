import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private baseUrl = 'http://localhost:8089/tpfoyer/livraisons'; // Adjust to your API URL

  constructor(private http: HttpClient) { }

  getLivraisonById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
