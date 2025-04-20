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
  allFilteredEvents: Event[] = [];
  filteredEvents: Event[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  eventsPerPage: number = 2;
  totalPages: number = 0;

  // Variables pour la modal
  isModalVisible: boolean = false;
  fullDescription: string = '';

  constructor(
    private eventService: EventServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  // Récupérer les événements depuis le service
  getEvents(): void {
    this.eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
        this.filterEvents();
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements :', error);
      }
    );
  }

  // Filtrage des événements en fonction de la recherche
  filterEvents(): void {
    const query = this.searchQuery.toLowerCase();

    this.allFilteredEvents = this.events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      return (
        event.name.toLowerCase().includes(query) ||
        startDate.toLocaleDateString().toLowerCase().includes(query) ||
        endDate.toLocaleDateString().toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
      );
    });

    this.totalPages = Math.ceil(this.allFilteredEvents.length / this.eventsPerPage);
    this.changePage(1); // Toujours revenir à la page 1 après un nouveau filtrage
  }

  // Changer de page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    const startIndex = (page - 1) * this.eventsPerPage;
    const endIndex = startIndex + this.eventsPerPage;

    this.filteredEvents = this.allFilteredEvents.slice(startIndex, endIndex);
  }

  // Naviguer vers l'édition d'un événement
  editEvent(event: Event): void {
    this.router.navigate(['/dashboard/edit-event', event.uuid_event]);
  }

  // Supprimer un événement
  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          this.events = this.events.filter(event => event.uuid_event !== eventId);
          this.filterEvents();
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
        }
      );
    }
  }

  // Afficher la description complète dans la modal
  showFullDescription(description: string): void {
    this.fullDescription = description;
    this.isModalVisible = true; // Ouvrir la modal
  }

  // Fermer la modal
  closeModal(): void {
    this.isModalVisible = false; // Fermer la modal
  }

  // Récupérer les 2 premiers mots de la description
  getFirstTwoWords(description: string): string {
    const words = description.split(' ');
    return words.slice(0, 2).join(' '); // Affiche les 2 premiers mots
  }
}
