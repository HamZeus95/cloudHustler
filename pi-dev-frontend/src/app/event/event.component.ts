import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from '../core/modules/event';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  participantName: string = 'hey';
  isLoading: boolean = true;
  errorMessage: string = '';
  searchText: string = '';
  countdown: { [key: string]: string } = {};
  mapVisibility: { [key: string]: boolean } = {};
  currentPage: number = 1;
  eventsPerPage: number = 3; // Nombre d'événements par page
  totalPages: number = 0;
  private countdownSubscription: Subscription | null = null;

  constructor(
    private eventService: EventServiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }

  loadEvents(): void {
    this.isLoading = true;

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.totalPages = Math.ceil(this.events.length / this.eventsPerPage); // Calcul du nombre total de pages
        this.filterEvents();  // Applique le filtrage avec la pagination
        this.isLoading = false;

        this.filteredEvents.forEach(event => {
          this.mapVisibility[event.uuid_event] = false;

          if (event.location) {
            this.getCoordinates(event.location).subscribe(coords => {
              if (coords && coords[0]) {
                const latitude = parseFloat(coords[0].lat);
                const longitude = parseFloat(coords[0].lon);
                this.initializeMap(latitude, longitude, event.uuid_event);
              }
            });
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des événements :", err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la récupération des événements. Veuillez réessayer plus tard.';
      }
    });
  }

  getCoordinates(location: string) {
    return this.eventService.getCoordinates(location);
  }

  // Applique le filtrage et la pagination
  filterEvents(): void {
    const lowerSearch = this.searchText.toLowerCase();
    let filtered = this.events.filter(event =>
      event.name.toLowerCase().includes(lowerSearch) ||
      event.description.toLowerCase().includes(lowerSearch) ||
      event.location.toLowerCase().includes(lowerSearch)
    );

    // Pagination - découper les événements selon la page actuelle
    const start = (this.currentPage - 1) * this.eventsPerPage;
    const end = start + this.eventsPerPage;
    filtered = filtered.slice(start, end);

    this.filteredEvents = filtered;
  }

  // Change de page et applique le filtrage
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterEvents();  // Applique le filtrage avec la nouvelle page
    }
  }

  participate(eventId: string): void {
    const event = this.events.find(e => e.uuid_event === eventId);
    if (!event) return;

    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      alert("Nombre maximal de participants atteint !");
      return;
    }

    this.eventService.addParticipant(eventId, this.participantName).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du participant :", err);
      }
    });
  }

  initializeMap(latitude: number, longitude: number, eventId: string): void {
    const mapId = `map${eventId}`;
    const map = L.map(mapId).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup('Lieu de l\'événement')
      .openPopup();
  }

  toggleMap(eventId: string): void {
    this.mapVisibility[eventId] = !this.mapVisibility[eventId];

    if (this.mapVisibility[eventId]) {
      const event = this.events.find(e => e.uuid_event === eventId);
      if (event && event.location) {
        this.getCoordinates(event.location).subscribe(coords => {
          if (coords && coords[0]) {
            const latitude = parseFloat(coords[0].lat);
            const longitude = parseFloat(coords[0].lon);
            this.initializeMap(latitude, longitude, eventId);
          }
        });
      }
    }
  }

  startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();

      this.filteredEvents.forEach(event => {
        const eventTime = new Date(event.startDate).getTime();
        const timeDiff = eventTime - now;

        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          this.countdown[event.uuid_event] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          this.countdown[event.uuid_event] = 'L\'événement a commencé';
        }
      });

      this.cdRef.detectChanges();
    });
  }
}
