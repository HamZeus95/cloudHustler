import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventServiceService } from '../event-service.service';
import { Event } from '../core/modules/event';
import * as L from 'leaflet';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];  // Liste filtrée des événements
  participantName: string = 'dd';
  isLoading: boolean = true;
  errorMessage: string = '';
  searchText: string = '';  // Variable pour la recherche

  // Objet pour gérer la visibilité des cartes de chaque événement
  mapVisibility: { [key: string]: boolean } = {}; 

  constructor(
    private eventService: EventServiceService,
    private cdRef: ChangeDetectorRef  // Injecter ChangeDetectorRef
  ) {}

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
        this.filteredEvents = this.events;  // Initialement, tous les événements sont affichés
        this.isLoading = false;

        // Initialiser la visibilité de la carte pour chaque événement
        this.filteredEvents.forEach(event => {
          this.mapVisibility[event.uuid_event] = false;  // Toutes les cartes sont invisibles au départ
          if (event.location) {
            this.getCoordinates(event.location).subscribe(coords => {
              if (coords && coords[0]) {
                const latitude = parseFloat(coords[0].lat);
                const longitude = parseFloat(coords[0].lon);
                this.initializeMap(latitude, longitude, event.uuid_event); // Initialiser la carte pour cet événement
              }
            });
          }
        });
      },
      error: (err) => {
        console.error("❌ Erreur lors de l’appel à getEvents :", err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la récupération des événements. Veuillez réessayer plus tard.';
      }
    });
  }

  getCoordinates(location: string) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1`;
    return this.eventService.getCoordinates(location);
  }

  filterEvents(): void {
    if (this.searchText) {
      this.filteredEvents = this.events.filter(event => 
        event.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredEvents = this.events;
    }
  }
  participate(eventId: string): void {
    const event = this.events.find(event => event.uuid_event === eventId);
    if (!event) return;
  
    // // Vérifier si le participant est déjà ajouté
    // if (event.participants?.includes(this.participantName)) {
    //   alert("⚠️ Vous avez déjà participé.");
    //   return;
    // }
  
    // Vérifier si le nombre de participants est atteint
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      alert("❌ Nombre maximal atteint !");
      return;
    }
  
    // Appel au service pour ajouter le participant
    this.eventService.addParticipant(eventId, this.participantName).subscribe({
      next: (updatedEvent) => {
        // Recharger les événements pour voir la mise à jour
        this.loadEvents();
        console.log("✅ Participant ajouté !");
      },
      error: (err) => {
        console.error("❌ Erreur ajout participant :", err);
      }
    });
  }
  
  
  
  


  // Fonction pour initialiser la carte
  initializeMap(latitude: number, longitude: number, eventId: string): void {
    const map = L.map(`map${eventId}`).setView([latitude, longitude], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    L.marker([latitude, longitude]).addTo(map)
      .bindPopup('Lieu de l\'événement')
      .openPopup();
  }

  // Fonction pour basculer la visibilité de la carte dans le pop-up
  toggleMap(eventId: string): void {
    // Bascule la visibilité de la carte
    this.mapVisibility[eventId] = !this.mapVisibility[eventId];

    // Si la carte est visible, réinitialiser la carte
    if (this.mapVisibility[eventId]) {
      const event = this.events.find(e => e.uuid_event === eventId);
      if (event && event.location) {
        this.getCoordinates(event.location).subscribe(coords => {
          if (coords && coords[0]) {
            const latitude = parseFloat(coords[0].lat);
            const longitude = parseFloat(coords[0].lon);
            this.initializeMap(latitude, longitude, eventId); // Initialiser la carte pour cet événement
          }
        });
      }
    }
  }
}
