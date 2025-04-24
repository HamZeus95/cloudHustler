import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from '../../models/livraison/livraison';

@Injectable({
  providedIn: 'root'
})
export class LivraisonPredictionService {
  private apiUrl = 'http://localhost:8090/tpfoyer/livraisons';

  constructor(private http: HttpClient) {}

  predictDelay(livraison: Livraison): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/predictdelay`, livraison);
  }
  predictEta(livraison: Livraison): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<number>(`${this.apiUrl}/predicteta`, livraison, { 
      headers: headers,
      withCredentials: true // Si vous utilisez des cookies pour l'authentification
    });
}}