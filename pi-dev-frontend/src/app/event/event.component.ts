import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from '../core/modules/event';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importation de HttpClient

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  participantName: string = 'mmm';
  isLoading: boolean = true;
  errorMessage: string = '';
  searchText: string = '';
  countdown: { [key: string]: string } = {};
  mapVisibility: { [key: string]: boolean } = {};
  currentPage: number = 1;
  eventsPerPage: number = 3; // Nombre d'événements par page
  totalPages: number = 0;
  private countdownSubscription: Subscription | null = null;
  selectedImages: { [key: string]: File } = {};
  selectedFile!: File;
  imageLink: string = '';
  uploadedImageUrls: { [key: string]: string } = {};

  // Injection de HttpClient dans le constructeur
  constructor(
    private eventService: EventServiceService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient  // Injection de HttpClient
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

  hasEventStarted(event: any): boolean {
    return new Date(event.startDate) <= new Date();
  }
  
  onFileSelected(event: any, currentEvent: any) {
    const file = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post<{ imageUrl: string }>('http://localhost:8089/pi/Event/upload', formData)
        .subscribe({
          next: (response) => {
            console.log('Réponse du serveur :', response);  // Afficher la réponse pour vérifier l'URL
            // Vérifier que l'URL est bien présente dans la réponse
            if (response && response.imageUrl) {
              this.uploadedImageUrls[currentEvent.uuid_event] = response.imageUrl;
            } else {
              console.error('URL de l\'image non trouvée dans la réponse');
            }
          },
          error: (err) => {
            console.error('Erreur lors de l\'upload :', err);
          }
        });
    }
  }
  
  }
  
 
  

  
  
  
  
  
 
  
  
