import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ressource } from '../models/famrs/resource';


@Injectable()
export class RessourceService {
  private apiUrl = environment.apiUrl+'ressource'; 

  constructor(private http: HttpClient) {}

  getRessources(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(`${this.apiUrl}/resources`);
  }

  getRessourceById(id: string): Observable<Ressource> {
    return this.http.get<Ressource>(`${this.apiUrl}/resource/${id}`);
  }

  addRessource(ressource: Ressource, idFarm: string): Observable<Ressource> {
    return this.http.post<Ressource>(`${this.apiUrl}/add/${idFarm}`, ressource);
  }

  updateRessource(ressource: Ressource): Observable<Ressource> {
    return this.http.put<Ressource>(`${this.apiUrl}/update`, ressource);
  }

  deleteRessource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
