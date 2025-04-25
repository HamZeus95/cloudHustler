import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8090/CloudHustel/api/files';

  constructor(private http:HttpClient) { }
  uploadFile(file: File,dir:string): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.post<any>(`${this.apiUrl}/upload/${dir}`, formData)
   
  }
  getFile(fileName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/download/${fileName}`, { responseType: 'blob' as 'json' });
  }

  resumefile(fileName: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/resume-extract/${fileName}`)
  }
}
