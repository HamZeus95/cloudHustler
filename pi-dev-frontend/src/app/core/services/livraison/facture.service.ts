import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Facture } from 'src/app/core/models/livraison/facture';
import { tap, catchError } from 'rxjs/operators';
import { DeliveryDriver } from '../../models/livraison/livraison';
import { Order } from '../../models/market/order.model';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseUrl = '/api/v1/factures'; // URL du backend
  factures: Facture[] = [];


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
  update(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.baseUrl}/${id}`, facture);
  }

  // Récupérer une facture par son ID
  getById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/${id}`); // GET pour récupérer une facture par son ID
  }
  marquerCommeAnnule(id: number): Observable<Facture> {
    return this.http.post<Facture>(`${this.baseUrl}/annuler/${id}`, {});
  }
  
  getFacturesCountByStatus(): Observable<{
    payee: number;
    enAttente: number;
    annulee: number;
    total: number;
  }> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(factures => {
        // Initialisation des compteurs
        const counts = {
          payee: 0,
          enAttente: 0,
          annulee: 0,
          total: factures.length
        };

        factures.forEach(f => {
          const status = this.normalizeStatus(f.statut);
          
          if (this.isStatusPayee(status)) {
            counts.payee++;
          } else if (this.isStatusEnAttente(status)) {
            counts.enAttente++;
          } else if (this.isStatusAnnulee(status)) {
            counts.annulee++;
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

  private isStatusPayee(status: string): boolean {
    return status.includes('PAID') || 
           status.includes('COMPLETED');
  }

  private isStatusEnAttente(status: string): boolean {
    return status.includes('PENDING') || 
           status.includes('WAITING');
  }

  private isStatusAnnulee(status: string): boolean {
    return status.includes('CANCELLED') || 
           status.includes('CANCELED') || 
           status.includes('REJECTED');
  }
   getFacturesByUser(uuid: string): Observable<Facture[]> {
      return this.http.get<Facture[]>(`${this.baseUrl}/by-user/${uuid}`);
    }
    getFacturesById(id: number): Observable<Facture[]> {
      return this.http.get<Facture[]>(`${this.baseUrl}/${id}`);
    }

    getAllDelivery(): Observable<DeliveryDriver[]> {
      return this.http.get<DeliveryDriver[]>(`${this.baseUrl}/delivery`);
    }
    getAllOrdres(): Observable<Order[]> {
      return this.http.get<Order[]>(`${this.baseUrl}/ordres`);
    }
}
