import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from '../../../core/services/event-service.service';
import { Event } from '../../../core/models/event';
import * as L from 'leaflet';
import { Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importation de HttpClient
import { AuthService } from '../../../auth/service/authentication.service';
import { TokenStorageService } from '../../../auth/service/token-storage.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
 // participantName: string = 'lll';
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
  imageUrls: { [eventId: string]: string } = {};
  private maps: { [key: string]: L.Map } = {};
  participants: string[] = [];

  // Variables pour la modal
  isModalVisible: boolean = false;
  fullDescription: string = '';
  currentUser: any = null;
  isAuthenticated = false;
  // Injection de HttpClient dans le constructeur
  constructor(
    private eventService: EventServiceService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient , // Injection de HttpClient
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.startCountdown();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.currentUser = this.tokenStorageService.getCurrentUser();
      }
      console.log(this.currentUser)
    });

    // Subscribe to user changes
    this.tokenStorageService.getUser().subscribe(user => {
      this.currentUser = user;
    });
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
          if (!event.participants) {
            event.participants = [];
          }
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

  onParticipate(eventId: string) {
    if (!this.currentUser?.userUUID) {
        alert('Utilisateur non connecté');
        return;
    }

    const event = this.events.find(e => e.uuid_event === eventId);
    if (!event) {
        alert('Événement introuvable');
        return;
    }

    // Vérifie si l'utilisateur participe déjà
    if (event.participants.includes(this.currentUser.userUUID)) {
        alert('Vous participez déjà à cet événement');
        return;
    }

    this.eventService.participate(eventId, this.currentUser.userUUID).subscribe({
        next: (updatedEvent) => {
            // Mettez à jour l'événement avec la réponse du serveur
            Object.assign(event, updatedEvent);
            this.events = [...this.events];
            console.log('Participation réussie !');
        },
     
      
    });
}
  

  private initializeMap(latitude: number, longitude: number, eventId: string): void {
    const mapId = `map${eventId}`;
    
    // Détruire la carte existante si elle existe
    if (this.maps[eventId]) {
      this.maps[eventId].remove();
    }

    // Configuration des icônes par défaut
    this.setDefaultIcon();

    // Création de la carte
    this.maps[eventId] = L.map(mapId, {
      center: [latitude, longitude],
      zoom: 13,
      preferCanvas: true
    });

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.maps[eventId]);

    // Ajout du marqueur
    L.marker([latitude, longitude], {
      title: 'Lieu de l\'événement'
    }).addTo(this.maps[eventId])
      .bindPopup('Lieu de l\'événement')
      .openPopup();
  }

  private setDefaultIcon(): void {
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
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
            
            setTimeout(() => {
              this.initializeMap(latitude, longitude, eventId);
            }, 50);
          }
        });
      }
    } else {
      // Nettoyage de la carte quand elle est fermée
      if (this.maps[eventId]) {
        this.maps[eventId].remove();
        delete this.maps[eventId];
      }
    }
  }

  ngOnDestroy(): void {
    // Nettoyer toutes les cartes
    Object.keys(this.maps).forEach(eventId => {
      this.maps[eventId].remove();
    });
    this.countdownSubscription?.unsubscribe();
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
  
  

  showFullDescription(description: string): void {
    this.fullDescription = description;
    this.isModalVisible = true; // Ouvrir la modal
  }

  // Fermer la modal
  closeModal(): void {
    this.isModalVisible = false; // Fermer la modal
  }

  selectedImage: { [key: string]: File } = {};

onImageSelected(event: any, eventId: string) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImage[eventId] = file;
  }
}

uploadImage(eventId: string) {
  const file = this.selectedImage[eventId];
  if (file) {
    const formData = new FormData();
    formData.append('file', file); // <-- changement ici

    
    this.eventService.uploadImage(eventId, formData).subscribe({
      next: (res) => {
        console.log('Image upload successful:', res);
        alert('Image envoyée avec succès !');

        this.imageUrls[eventId] = res.imageUrl; 
      },
      error: (err) => {
        console.error('Erreur lors de l\'upload :', err);
        alert('Erreur lors de l\'upload.');
      }
    });
  } else {
    alert('Veuillez sélectionner une image avant d\'envoyer.');
  }
}
openImage(url: string) {
  window.open(url, '_blank');
}


  }
  
 
  

  
  
  
  
  
 
  
  