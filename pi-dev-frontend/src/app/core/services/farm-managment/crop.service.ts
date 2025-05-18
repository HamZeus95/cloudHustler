import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crop } from 'src/app/core/models/famrs/crop';
import { environment } from 'src/environments/environment';


@Injectable()
export class CropService {
  private apiUrl = '/api/v1/crop'; 
  private aiWebhookUrl = 'https://mda-dhia-alaya.app.n8n.cloud/webhook-test/new-crop';


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
  // ngrok config add-authtoken 2ChUqG7xv4a9vwCXBuMaGK8ttNY_4yn6bEmzdFTTSYE5vLJP7
  // ngrok http http://localhost:8090
  triggerTaskGeneration(crop: Crop): Observable<any> {
    return this.http.post(this.aiWebhookUrl, crop);
  }



}
