import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicee } from 'src/app/core/models/servicee';


@Injectable({
  providedIn: 'root'
})
export class ServiceeService {
  private apiUrl = 'http://localhost:8090/CloudHustel/services';

  constructor(private http: HttpClient) {}

  // Récupérer tous les services
  getAllServices(): Observable<Servicee[]> {
    return this.http.get<Servicee[]>(`${this.apiUrl}/getService`);
  }

  // Créer un nouveau service
  createService(service: Servicee): Observable<Servicee> {
    return this.http.post<Servicee>(`${this.apiUrl}/addService`, service);
  }

  // Supprimer un service
  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteService/${id}`);
  }
  updateService(id: string, service: Servicee): Observable<Servicee> {
    return this.http.put<Servicee>(`${this.apiUrl}/updateService/${id}`, service);
  }
  getServiceById(uuid_service: string): Observable<Servicee> {
    const url = `${this.apiUrl}/${uuid_service}`;
    return this.http.get<Servicee>(url);

  
}}
