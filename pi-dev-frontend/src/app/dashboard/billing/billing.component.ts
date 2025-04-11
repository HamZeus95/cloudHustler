import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventServiceService } from 'src/app/event-service.service';
import { Event } from 'src/app/core/modules/event';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  events: Event[] = [];

  constructor(
    private eventService: EventServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEvents();  // Récupérer les événements au démarrage du composant
  }

  // Récupérer la liste des événements
  getEvents(): void {
    this.eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
        console.log('Events fetched:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  // Méthode pour naviguer vers la page d'édition d'un événement
  editEvent(event: Event): void {
    this.router.navigate(['/dashboard/edit-event', event.uuid_event]);
  }

  // Supprimer un événement
  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.events = this.events.filter(event => event.uuid_event !== eventId);
          console.log('Event deleted successfully');
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    }
  }
}
