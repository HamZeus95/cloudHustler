import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from 'src/app/core/modules/event';
import { Observable, tap } from 'rxjs';

@Injectable()
export class EventServiceService {
 

  private apiUrl = 'http://localhost:8089/pi/Event'; 
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
  addParticipant(eventId: string, participantName: string): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${eventId}/participate`, { participantName });
  }
}
