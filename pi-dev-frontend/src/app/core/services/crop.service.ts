import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crop } from 'src/app/core/models/famrs/crop';


@Injectable()
export class CropService {
  private apiUrl = 'http://localhost:8090/pidb/crop'; 

  constructor(private http: HttpClient) {}

  getCrops(): Observable<Crop[]> {
    return this.http.get<Crop[]>(`${this.apiUrl}/crops`);
  }

  getCropById(id: string): Observable<Crop> {
    return this.http.get<Crop>(`${this.apiUrl}/crop/${id}`);
  }

  addCrop(crop: Crop, idFarm: string): Observable<Crop> {
    return this.http.post<Crop>(`${this.apiUrl}/add/${idFarm}`, crop);
  }

  updateCrop(crop: Crop): Observable<Crop> {
    return this.http.put<Crop>(`${this.apiUrl}/update`, crop);
  }

  deleteCrop(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
