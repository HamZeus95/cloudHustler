import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private flaskUrl = 'http://localhost:5050/analyze-image'; // Flask endpoint

  constructor(private http: HttpClient) {}

  analyzeImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.flaskUrl, formData);
  }
}
