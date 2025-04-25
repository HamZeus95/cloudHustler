import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailJobsServiceService {
  private apiUrl = 'http://localhost:8090/CloudHustel/api/emails/emails/send';

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const params = new HttpParams()
      .set('to', to)
      .set('subject', subject)
      .set('body', body);

    return this.http.post(this.apiUrl, null, {
      params,
      responseType: 'text', // important pour éviter une erreur de parsing
    });
  }

}
