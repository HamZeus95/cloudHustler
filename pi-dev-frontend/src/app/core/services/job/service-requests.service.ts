import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { TypeStatus } from 'src/app/core/models/typeStatus';
import { ServiceRequest } from 'src/app/core/models/serviceRequests';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestsService {

  private apiUrl = 'http://localhost:8090/api/v1/service-requests';

    constructor(private http: HttpClient) { }


    getAllServiceRequests(): Observable<ServiceRequest[]> {
      return this.http.get<ServiceRequest[]>(`${this.apiUrl}/getAll`);
    }
  
    // Obtenir une demande de service par son ID
    getServiceRequestById(id: string): Observable<ServiceRequest> {
      return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
    }
  
    // Ajouter une nouvelle demande de service
    createServiceRequest(serviceRequest:any): Observable<ServiceRequest> {
      return this.http.post<ServiceRequest>(`${this.apiUrl}/add`, serviceRequest);
    }
  
    // Mettre à jour une demande de service
    updateServiceRequest(id: string, serviceRequest: ServiceRequest): Observable<ServiceRequest> {
      return this.http.put<ServiceRequest>(`${this.apiUrl}/update/${id}`, serviceRequest);
    }
    updateScoreServiceReqesut(id:string,score:number):Observable<ServiceRequest>{
      return this.http.put<ServiceRequest>(`${this.apiUrl}/updateScore/${id}/${score}`,{})
    }
  
    // Supprimer une demande de service
    deleteServiceRequest(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    } 
    createServiceRequestForService(uuid_service: string, serviceRequest: ServiceRequest): Observable<ServiceRequest> {
      return this.http.post<ServiceRequest>(`${this.apiUrl}/${uuid_service}/createServiceRequest`, serviceRequest);
    }
   getStatusCounts(): Observable<{ accepted: number, rejected: number, pending: number }> {
  return this.http.get<{ accepted: number, rejected: number, pending: number }>(`${this.apiUrl}/statistics/status-counts`);
}

    
    
    submitServiceRequest(serviceRequest: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/submit`, serviceRequest, {
      
      }); }}
