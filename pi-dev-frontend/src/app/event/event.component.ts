import { Component, OnInit } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from '../core/modules/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];  // Liste filtrée des événements
  participantName: string = 'John Doe';
  isLoading: boolean = true;
  errorMessage: string = '';
  searchText: string = '';  // Variable pour la recherche

  constructor(private eventService: EventServiceService) {}

  ngOnInit(): void {
    console.log("🟡 Composant initialisé");
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;

    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log("✅ Données récupérées depuis Spring :", data);
        this.events = data;
        this.filteredEvents = data; // Initialement, tous les événements sont affichés
        this.isLoading = false;
      },
      error: (err) => {
        console.error("❌ Erreur lors de l’appel à getEvents :", err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la récupération des événements. Veuillez réessayer plus tard.';
      }
    });
  }

  filterEvents(): void {
    if (this.searchText) {
      // Filtrer les événements par nom, description ou lieu en fonction de la recherche
      this.filteredEvents = this.events.filter(event => 
        event.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      // Si aucun texte de recherche, afficher tous les événements
      this.filteredEvents = this.events;
    }
  }

  participate(eventId: string): void {
    console.log(`👤 ${this.participantName} souhaite participer à l'événement avec ID : ${eventId}`);
    
    const event = this.events.find(event => event.uuid_event === eventId);
    if (event?.participants?.includes(this.participantName)) {
      console.log("⚠️ Participant déjà ajouté.");
      return;
    }

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
        this.errorMessage = 'Erreur lors de l\'ajout du participant. Veuillez réessayer.';
      }
    });
  }
}
