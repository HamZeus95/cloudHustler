import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bounds } from 'leaflet';
import mapboxgl from 'mapbox-gl';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonPredictionService } from 'src/app/core/services/livraison/livraison-prediction-service.service';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';

@Component({
  selector: 'app-livraison-clientdetails',
  templateUrl: './livraison-clientdetails.component.html',
  styleUrls: ['./livraison-clientdetails.component.css']
})
export class LivraisonClientdetailsComponent implements OnInit {
  livraisonDetails: any;
  private readonly MAPBOX_TOKEN = 'pk.eyJ1IjoibG91YXloMTEiLCJhIjoiY205cHFoejNqMGt6MjJqczRlN3JxYjl6aiJ9.r_vwTnPHgJfRZoE-YRKtNA';

  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService,
    private predictionService: LivraisonPredictionService
  ) {}

  ngOnInit() {
    // Initialize Mapbox
    mapboxgl.accessToken = this.MAPBOX_TOKEN;
    
    const id = this.route.snapshot.params['id'];
    this.livraisonService.getLivraisonsById(id).subscribe({
      next: (data) => {
        this.livraisonDetails = data;
        // Démarrer le suivi de position immédiatement
        this.startTrackingLivraison();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  annulerLivraison() {
    if (this.livraisonDetails && this.livraisonDetails.statut.toUpperCase() === 'EN ATTENTE') {
      // Créer une copie de l'objet avec le nouveau statut
      const updatedLivraison = { ...this.livraisonDetails, statut: 'ANNULÉE' };
      
      // Utiliser la méthode update existante
      this.livraisonService.update(this.livraisonDetails.id, updatedLivraison).subscribe({
        next: (response) => {
          this.livraisonDetails = response;
          alert('La livraison a été annulée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          alert('Erreur lors de l\'annulation de la livraison');
        }
      });
    } else {
      alert('Impossible d\'annuler cette livraison. Elle n\'est pas en attente.');
    }
  }
  predictDelay(livraison: Livraison) {
      this.predictionService.predictDelay(livraison).subscribe(
        (isDelayed) => {
          livraison.statut = isDelayed ? 'En retard' : livraison.statut;
        },
        (error) => {
          console.error('Erreur lors de la prédiction:', error);
        }
      );
    }
    predictEta(livraison: Livraison) {
      this.getDriverLocation().then((location) => {
        const driverLocation = `${location.latitude},${location.longitude}`;
       // console.log('Position actuelle du livreur:', driverLocation);

        if (livraison.deliveryDriver) {
          livraison.deliveryDriver.positionLivreur = driverLocation; // Utiliser la position GPS comme origine
        }
    
        this.predictionService.predictEta(livraison).subscribe(
          (eta) => {
            this.etaMap[livraison.id] = eta; // Stocker l'ETA pour cette livraison
          },
          (error) => {
            console.error('Erreur lors de la prédiction de l\'ETA:', error);
          }
        );
      }).catch((error) => {
        console.error('Impossible de récupérer la position GPS:', error);
      });
    }
    getDriverLocation(): Promise<{ latitude: number; longitude: number }> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Géolocalisation non supportée'));
          return;
        }
    
        const options = {
          enableHighAccuracy: true,
          timeout: 20000,  // Increased timeout to 20 seconds
          maximumAge: 5000 // Cache position for 5 seconds
        };
    
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            let errorMessage = 'Erreur de géolocalisation';
            switch(error.code) {
              case error.TIMEOUT:
                errorMessage = 'Délai de géolocalisation dépassé';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Position non disponible';
                break;
              case error.PERMISSION_DENIED:
                errorMessage = 'Permission de géolocalisation refusée';
                break;
            }
            reject(new Error(errorMessage));
          },
          options
        );
      });
    }
    retryGeolocation() {
      this.livreurPositionError = null;
      this.updateLivreurPosition();
    }
    etaMap: { [key: number]: number } = {}; // Stocker les ETA pour chaque livraison
// Ajoutez cette méthode à votre composant
formatEta(minutes: number): string {
  if (!minutes) return 'Calcul en cours...';
  
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + minutes * 60000);
  
  // Formatage : "Aujourd'hui à 14:30" ou "Demain à 09:15"
  if (arrivalTime.getDate() === now.getDate()) {
    return `Aujourd'hui à ${arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  } else if (arrivalTime.getDate() === now.getDate() + 1) {
    return `Demain à ${arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  } else {
    return arrivalTime.toLocaleString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
// Déclarez ces variables en haut de votre composant
livreurPosition: { latitude: number, longitude: number } | null = null;
livreurPositionError: string | null = null;
positionUpdateInterval: any;

// Méthode pour démarrer le suivi en temps réel
startTrackingLivraison() {
  // Vérifiez si une livraison est sélectionnée
  if (!this.livraisonDetails?.deliveryDriver) {
    this.livreurPositionError = "Aucun livreur assigné";
    return;
  }

  // Clear existing interval if any
  if (this.positionUpdateInterval) {
    clearInterval(this.positionUpdateInterval);
  }

  // Initial position update
  this.updateLivreurPosition();

  // Set new interval
  this.positionUpdateInterval = setInterval(() => {
    this.updateLivreurPosition();
  }, 30000);
}

// Méthode pour obtenir/mettre à jour la position
updateLivreurPosition() {
  if (!this.livraisonDetails?.deliveryDriver) {
    console.warn('Pas de livreur assigné');
    return;
  }

  this.getDriverLocation().then(position => {
    console.log('Position obtenue:', position);
    this.livreurPosition = position;
    this.livreurPositionError = null;
    
    // Mettre à jour la position dans l'objet livraisonDetails
    if (this.livraisonDetails.deliveryDriver) {
      this.livraisonDetails.deliveryDriver.positionLivreur = 
        `${position.latitude},${position.longitude}`;
    }
  }).catch(error => {
    console.error('Erreur de position:', error);
    this.livreurPositionError = this.getPositionErrorMessage(error);
  });
}

// Méthode pour calculer la distance (en km)
calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = this.deg2rad(lat2 - lat1);
  const dLon = this.deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(2)); // Distance en km avec 2 décimales
}

private deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Gestion des erreurs
getPositionErrorMessage(error: any): string {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      return "Vous avez refusé l'accès à la géolocalisation";
    case error.POSITION_UNAVAILABLE:
      return "Position indisponible";
    case error.TIMEOUT:
      return "Délai de requête dépassé";
    default:
      return "Erreur inconnue lors de la géolocalisation";
  }
}

// N'oubliez pas de nettoyer l'intervalle
ngOnDestroy() {
  if (this.positionUpdateInterval) {
    clearInterval(this.positionUpdateInterval);
    this.positionUpdateInterval = null;
  }
}
    


showOnMap() {
  if (!mapboxgl.accessToken) {
    console.error('Token Mapbox non initialisé');
    return;
  }

  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) {
    console.error('Conteneur de carte non trouvé');
    return;
  }

  if (!this.livreurPosition) {
    console.error('Position du livreur non disponible');
    return;
  }

  try {
    // Clear existing map if any
    mapContainer.innerHTML = '';

    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.livreurPosition.longitude, this.livreurPosition.latitude],
      zoom: 13
    });

    map.on('load', () => {
      // Add driver marker
      new mapboxgl.Marker({ color: '#3498db' })
        .setLngLat([
          this.livreurPosition?.longitude ?? 0, 
          this.livreurPosition?.latitude ?? 0
        ])
        .setPopup(new mapboxgl.Popup().setHTML("<b>Position du livreur</b>"))
        .addTo(map);

      // Add destination marker if available
      if (this.livraisonDetails?.endLat && this.livraisonDetails?.endLng) {
        new mapboxgl.Marker({ color: '#e74c3c' })
          .setLngLat([this.livraisonDetails.endLng, this.livraisonDetails.endLat])
          .setPopup(new mapboxgl.Popup().setHTML("<b>Destination</b>"))
          .addTo(map);

        // Fit bounds to show both markers
        const bounds = new mapboxgl.LngLatBounds()
          .extend([
            this.livreurPosition?.longitude ?? 0, 
            this.livreurPosition?.latitude ?? 0
          ])
          .extend([this.livraisonDetails.endLng, this.livraisonDetails.endLat]);
        
        map.fitBounds(bounds, { padding: 50 });
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la carte:', error);
  }
}


  }
