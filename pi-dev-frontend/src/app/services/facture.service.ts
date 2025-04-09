import { Injectable } from '@angular/core';
import { Facture } from '../models/facture';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseUrl = 'http://localhost:8090/tpfoyer/factures'; // URL du backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les factures
  getAll(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.baseUrl);
  }

  // Ajouter une facture
  add(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.baseUrl, facture);  // POST pour créer une facture
  }

  // Supprimer une facture
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); // DELETE pour supprimer une facture
  }

  // Mettre à jour une facture
  update(id: number, updated: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.baseUrl}/${id}`, updated); // PUT pour mettre à jour une facture
  }

  // Récupérer une facture par son ID
  getById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/${id}`); // GET pour récupérer une facture par son ID
  }
  marquerCommePayee(id: number): Observable<Facture> {
    return this.http.post<Facture>(`${this.baseUrl}/${id}`, {});
  }
}
