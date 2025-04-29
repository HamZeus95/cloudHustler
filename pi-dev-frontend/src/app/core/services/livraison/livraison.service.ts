import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,Observable } from 'rxjs';
import { Livraison } from 'src/app/core/models/livraison/livraison';

@Injectable({ providedIn: 'root' })
export class LivraisonService {
  private baseUrl = '/api/v1/livraisons';
  livraisons: Livraison[] = [];

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

  getLivraisonsByUser(uuid: string): Observable<Livraison[]> {
    console.log('Fetching deliveries for user:', uuid);
    return this.http.get<Livraison[]>(`${this.baseUrl}/by-user/${uuid}`);
  }
  getLivraisonsBydriver(uuid: string): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.baseUrl}/bydriver/${uuid}`);
  }
  getLivraisonsById(id: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.baseUrl}/${id}`);
  }

  getLivraisonsCountByStatus(): Observable<{
      livree: number;
      enAttente: number;
      enTransit: number;
      total: number;
      //En attente|En transit|Livrée
    }> {
      return this.http.get<any[]>(this.baseUrl).pipe(
        map((livraisons) => {
          // Initialisation des compteurs
          const counts = {
            livree: 0,
            enAttente: 0,
            enTransit: 0,
            total: livraisons.length
          };
  
          livraisons.forEach(l => {
            const status = this.normalizeStatus(l.statut);
            
            if (this.isStatusLivree(status)) {
              counts.livree++;
            } else if (this.isStatusEnAttente(status)) {
              counts.enAttente++;
            } else if (this.isStatusEnTransit(status)) {
              counts.enTransit++;
            }
          });
  
          return counts;
        })
      );
    }
  
    private normalizeStatus(status: string): string {
      return (status || '')
        .toString()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    }
  
    private isStatusLivree(status: string): boolean {
      return status.includes('DELIVERED') || 
             status.includes('DELEVRED') || 
             status.includes('COMPLETE');
    }
  
    private isStatusEnAttente(status: string): boolean {
      return status.includes('PENDING') || 
             status.includes('WAITING');
    }
  
    private isStatusEnTransit(status: string): boolean {
      return status.includes('TRANSIT') || 
             status.includes('IN_TRANSIT') || 
             status.includes('SHIPPING');
    }
    getPrediction(origin: string, destination: string): Observable<number> {
      return this.http.get<number>('/api/v1/livraison/predict-time', {
        params: { origin, destination }
      });
}}
