import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { TypeStatus } from 'src/core/modules/typeStatus';
import { ServiceRequest } from 'src/core/modules/serviceRequests';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private apiUrl = 'http://localhost:8090/CloudHustel/service-requests';

    constructor(private http: HttpClient) { }


    getAllServiceRequests(): Observable<ServiceRequest[]> {
      return this.http.get<ServiceRequest[]>(`${this.apiUrl}/getAll`);
    }
  
    // Obtenir une demande de service par son ID
    getServiceRequestById(id: string): Observable<ServiceRequest> {
      return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
    }
  
    // Ajouter une nouvelle demande de service
    createServiceRequest(serviceRequest: ServiceRequest): Observable<ServiceRequest> {
      return this.http.post<ServiceRequest>(`${this.apiUrl}/add`, serviceRequest);
    }
  
    // Mettre à jour une demande de service
    updateServiceRequest(id: string, serviceRequest: ServiceRequest): Observable<ServiceRequest> {
      return this.http.put<ServiceRequest>(`${this.apiUrl}/update/${id}`, serviceRequest);
    }
  
    // Supprimer une demande de service
    deleteServiceRequest(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    } 
    createServiceRequestForService(uuid_service: string, serviceRequest: ServiceRequest): Observable<ServiceRequest> {
      return this.http.post<ServiceRequest>(`${this.apiUrl}/${uuid_service}/createServiceRequest`, serviceRequest);
    }
    submitServiceRequest(serviceRequest: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/submit`, serviceRequest, {
      
      }); }}
