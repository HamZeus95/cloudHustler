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
  depotCoords: [number, number] = [10.1815, 36.8065]; // Coordonnées du dépôt
  searchAddress: string = '';

  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService
  ) {
    this.livraisonId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibG91YXloMTEiLCJhIjoiY205cHFoejNqMGt6MjJqczRlN3JxYjl6aiJ9.r_vwTnPHgJfRZoE-YRKtNA';
    this.initializeMap();
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.depotCoords,
      zoom: 12
    });

    this.map.on('load', () => {
      this.loadLivraisonAndDrawRoute();
    });
  }

  private loadLivraisonAndDrawRoute() {
    this.livraisonService.getLivraisonsById(this.livraisonId).subscribe(livraisons => {
      const livraison = livraisons[0]; // Assuming you want the first livraison
      if (livraison && livraison.adresseLivraison) {
        this.geocodeAddress(livraison.adresseLivraison).then(coords => {
          // Ajouter les marqueurs
          new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat(this.depotCoords)
            .setPopup(new mapboxgl.Popup().setHTML('<h3>Point de départ</h3>'))
            .addTo(this.map);

          new mapboxgl.Marker({ color: '#00FF00' })
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3><p>${livraison.adresseLivraison}</p>`))
            .addTo(this.map);

          // Tracer la route
          this.getRoute(this.depotCoords, coords);
          
          // Ajuster la vue
          const bounds = new mapboxgl.LngLatBounds()
            .extend(this.depotCoords)
            .extend(coords);
          this.map.fitBounds(bounds, { padding: 100 });
        }).catch(error => {
          console.error('Erreur lors du géocodage:', error);
        });
      }
    });
  }

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

  async searchRoute() {
    if (!this.searchAddress) return;

    try {
      const coords = await this.geocodeAddress(this.searchAddress);
      
      // Clear existing markers
      this.clearMarkers();

      // Add new markers
      new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(this.depotCoords)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Point de départ</h3>'))
        .addTo(this.map);

      new mapboxgl.Marker({ color: '#00FF00' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3><p>${this.searchAddress}</p>`))
        .addTo(this.map);

      // Draw route
      this.getRoute(this.depotCoords, coords);
      
      // Adjust view
      const bounds = new mapboxgl.LngLatBounds()
        .extend(this.depotCoords)
        .extend(coords);
      this.map.fitBounds(bounds, { padding: 100 });
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
