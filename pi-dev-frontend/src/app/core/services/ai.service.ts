import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private flaskUrl = 'http://localhost:5050/analyze-image'; // Flask endpoint
  //private flaskUrl = 'https://11f2-197-19-214-79.ngrok-free.app/analyze-image';
   

  constructor(private http: HttpClient) {}

  analyzeImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.flaskUrl, formData);
  }
}
