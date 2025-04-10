import { Component, OnInit } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from 'src/app/core/modules/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  participantName: string = 'John Doe'; // Exemple de nom de participant, tu peux le rendre dynamique si nécessaire

  constructor(private eventService: EventServiceService) {}

  ngOnInit(): void {
    console.log("🟡 Composant initialisé");

    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log("✅ Données récupérées depuis Spring :", data);
        this.events = data;
      },
      error: (err) => {
        console.error("❌ Erreur lors de l’appel à getEvents :", err);
      }
    });
  }

  participate(eventId: string): void {
    console.log(`👤 ${this.participantName} souhaite participer à l'événement avec ID : ${eventId}`);
    this.eventService.addParticipant(eventId, this.participantName).subscribe({
      next: (updatedEvent) => {
        console.log("✅ Participant ajouté :", updatedEvent);
        const index = this.events.findIndex(event => event.uuid_event === eventId);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
      },
      error: (err) => {
        console.error("❌ Erreur lors de l'ajout du participant :", err);
      }
    });
  }
}
