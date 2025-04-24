import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  livraisonId: number;
  driverCoords: [number, number] | null = null;
  depotCoords: [number, number] = [10.1815, 36.8065]; // Example coordinates for the depot
  searchAddress: string = '';
  // Duplicate declaration removed

  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService
  ) {
    this.livraisonId = this.route.snapshot.params['id'];
  }

  async ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibG91YXloMTEiLCJhIjoiY205cHFoejNqMGt6MjJqczRlN3JxYjl6aiJ9.r_vwTnPHgJfRZoE-YRKtNA';
    await this.getDriverPosition();
    this.initializeMap();
  }

  private async getDriverPosition() {
    try {
      const position = await this.getDriverLocation();
      this.driverCoords = [position.longitude, position.latitude];
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      // Utiliser des coordonnées par défaut si la géolocalisation échoue
      this.driverCoords = [10.1815, 36.8065]; // Coordonnées par défaut
    }
  }

  private initializeMap() {
    if (!this.driverCoords) return;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.driverCoords,
      zoom: 12
    });

    this.map.on('load', () => {
      this.loadLivraisonAndDrawRoute();
    });
  }

  private loadLivraisonAndDrawRoute() {
    this.livraisonService.getLivraisonsById(this.livraisonId).subscribe(livraisons => {
      const livraison = livraisons[0];
      if (livraison && livraison.adresseLivraison && this.driverCoords) {
        this.geocodeAddress(livraison.adresseLivraison).then(coords => {
          // Ajouter les marqueurs
          new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat(this.driverCoords!)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Position du livreur</h3>'))
            .addTo(this.map);

          new mapboxgl.Marker({ color: '#00FF00' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3><p>${livraison.adresseLivraison}</p>`))
            .addTo(this.map);

          // Tracer la route
          if (this.driverCoords) {
            this.getRoute(this.driverCoords, coords);
          }
          
          // Ajuster la vue
          if (this.driverCoords) {
            const bounds = new mapboxgl.LngLatBounds()
              .extend(this.driverCoords)
              .extend(coords);
            this.map.fitBounds(bounds, { padding: 100 });
          }
        }).catch(error => {
          console.error('Erreur lors du géocodage:', error);
        });
      }
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
        timeout: 20000,
        maximumAge: 5000
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

  // ... (gardez les autres méthodes existantes: geocodeAddress, getRoute, searchRoute, clearMarkers, predictDeliveryTime)


  private async geocodeAddress(address: string): Promise<[number, number]> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=tn&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Adresse non trouvée');
      }
      
      return data.features[0].center as [number, number];
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      throw error;
    }
  }

  private async getRoute(start: [number, number], end: [number, number]) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (this.map.getSource('route')) {
      (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
    } else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }

    // Ajuster la vue pour montrer toute la route
    const bounds = new mapboxgl.LngLatBounds()
      .extend(start)
      .extend(end);
    this.map.fitBounds(bounds, { padding: 50 });
  }
  private drawRouteAndMarkers(destinationCoords: [number, number], address: string) {
    if (!this.driverCoords) return;

    // Clear previous markers and route
    this.clearMarkers();

    // Add markers
    new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat(this.driverCoords)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Position actuelle du livreur</h3>'))
      .addTo(this.map);

    new mapboxgl.Marker({ color: '#00FF00' })
      .setLngLat(destinationCoords)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3><p>${address}</p>`))
      .addTo(this.map);

    // Draw route
    this.getRoute(this.driverCoords, destinationCoords);

    // Adjust view
    const bounds = new mapboxgl.LngLatBounds()
      .extend(this.driverCoords)
      .extend(destinationCoords);
    this.map.fitBounds(bounds, { padding: 100 });
  }

  async searchRoute() {
    if (!this.searchAddress || !this.driverCoords) return;

    try {
      const coords = await this.geocodeAddress(this.searchAddress);
      this.drawRouteAndMarkers(coords, this.searchAddress);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      alert('Adresse non trouvée. Veuillez réessayer.');
    }
  }
  private clearMarkers() {
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers.length > 0) {
      markers[0].remove();
    }

    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
    if (this.map.getSource('route')) {
      this.map.removeSource('route');
    }
  }
  predictedTime: number | null = null;

predictDeliveryTime() {
  const origin = "48.8566,2.3522"; // Paris (exemple, peut être récupéré dynamiquement)
  const destination = "43.6043,1.4437"; // Toulouse (exemple, peut être récupéré dynamiquement)

  this.livraisonService.getPrediction(origin, destination).subscribe(
    (res) => {
      this.predictedTime = res;
    },
    (error) => {
      console.error("Erreur :", error);
    }
  );
}
}
