import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from '../models/event';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
 

  private apiUrl = '/api/v1/Event'; 
  constructor(private http: HttpClient) { }
  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/addEvent`, event);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/getEvents`).pipe(
      tap((events) => {
        console.log('Events:', events);  // Affiche les événements dans la console
      })
    );
  }
  

  updateEvent(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/updateEvent`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${id}`);
  }
 
  getEventById(id: string): Observable<Event> {
    const url = `${this.apiUrl}/events/${id}`;
    return this.http.get<Event>(url);
  }
  getCoordinates(location: string): Observable<any> {
    // Utilisez Nominatim pour obtenir les coordonnées à partir du lieu
    return this.http.get<any>(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1`
    );
  }
  addParticipant(eventId: string, participantName: string) {
    return this.http.put<Event>(`http://localhost:8089/pi/Event/${eventId}/add-participant`, participantName, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  generateDescription(name: string, location: string, date: string) {
    return this.http.post('/api/v1/Event/generate-description', {
      name,
      location,
      date
    }, { responseType: 'text' }); // Important pour récupérer une chaîne simple
  }
  
  uploadImage(eventId: string, formData: FormData) {
    return this.http.post<any>(`/api/v1/Event/${eventId}/upload-image`, formData);
  }
  
  
}
