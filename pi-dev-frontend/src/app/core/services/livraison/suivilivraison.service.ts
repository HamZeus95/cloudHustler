import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SuiviLivraison } from 'src/app/core/models/livraison/suivilivraison';

@Injectable({
  providedIn: 'root'
})
export class SuiviLivraisonService {
  private suivis: SuiviLivraison[] = [];
  private baseUrl = '/api/v1/suiviLivraison';
  constructor(private http: HttpClient) {}

  getAll(): SuiviLivraison[] {
    return this.suivis;
  }

  add(suivi: SuiviLivraison) {
    suivi.id = Date.now();
    this.suivis.push(suivi);
  }

  delete(id: number) {
    this.suivis = this.suivis.filter(s => s.id !== id);
  }

  update(id: number, updated: SuiviLivraison) {
    const index = this.suivis.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suivis[index] = { ...updated, id };
    }
  }

  getById(id: number): SuiviLivraison | undefined {
    return this.suivis.find(s => s.id === id);
  }

  getHistoriqueByLivraisonId(livraisonId: number): Observable<SuiviLivraison[]> {
    // Replace with actual implementation returning an Observable
    return this.http.get<SuiviLivraison[]>(`${this.baseUrl}/${livraisonId}`);
  }
}
