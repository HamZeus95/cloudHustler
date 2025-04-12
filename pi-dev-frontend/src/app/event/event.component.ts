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
  participantName: string = 'elaa';
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
  
    // Charger les événements depuis localStorage s'ils existent
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      console.log("✅ Chargement des événements depuis localStorage");
      this.events = JSON.parse(storedEvents);
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
    } else {
      // Si aucun événement n'est stocké, récupérer les données depuis le service
      this.eventService.getEvents().subscribe({
        next: (data) => {
          console.log("✅ Données récupérées depuis Spring :", data);
          this.events = data;
          this.filteredEvents = this.events;
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
          console.error("❌ Erreur lors de la récupération des événements :", err);
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la récupération des événements. Veuillez réessayer plus tard.';
        }
      });
    }
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
    console.log(`👤 ${this.participantName} souhaite participer à l'événement avec ID : ${eventId}`);
    
    // Trouver l'événement correspondant à l'ID
    const event = this.events.find(event => event.uuid_event === eventId);
    
    if (!event) {
      console.log("⚠️ L'événement n'a pas été trouvé.");
      return;
    }
    
    // Vérifier si le participant est déjà dans la liste
    if (event.participants?.includes(this.participantName)) {
      console.log("⚠️ Participant déjà ajouté.");
      return;
    }
  
    // Ajouter le participant à la liste
    if (!event.participants) {
      event.participants = []; // Si la liste des participants n'existe pas, la créer
    }
  
    // Ajouter le nom du participant à la liste des participants
    event.participants.push(this.participantName);
  
    // Mettre à jour la liste des événements pour refléter la modification
    const index = this.events.findIndex(e => e.uuid_event === eventId);
    if (index !== -1) {
      this.events[index] = { ...event };  // Mettre à jour l'événement avec la nouvelle liste de participants
    }
  
    // Sauvegarder la liste des événements mise à jour dans localStorage
    localStorage.setItem('events', JSON.stringify(this.events));
  
    // Réactualiser la liste filtrée des événements
    this.filteredEvents = [...this.events];
  
    console.log("✅ Participant ajouté :", event);
  
    // Mettre à jour le nombre de participants dans la vue
    this.cdRef.detectChanges(); // Cela permet de forcer la mise à jour de la vue si nécessaire
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
