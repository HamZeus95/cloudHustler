import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  geocodeAddress(address: string): Observable<any> {
    return this.http.get(`${this.apiUrl}mapbox/geocode?address=${encodeURIComponent(address)}`);
  }

  getLocationUpdates(deliveryId: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(`${this.apiUrl}updates`);
      
      eventSource.onmessage = event => {
        observer.next(JSON.parse(event.data));
      };

      eventSource.onerror = error => {
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }
}