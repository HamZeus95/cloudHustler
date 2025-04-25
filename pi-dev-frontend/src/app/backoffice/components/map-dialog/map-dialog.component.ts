import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css'],
})
export class MapDialogComponent implements AfterViewInit {
  
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  selectedLngLat: mapboxgl.LngLat | null = null;

  ngAfterViewInit(): void {
    const modal = document.getElementById('mapModal');
    modal?.addEventListener('shown.bs.modal', () => {
      this.initializeMap();
    });
  }

  initializeMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoibWRhMjAwMCIsImEiOiJjbTl0bW1sb2owMGY5MmxzOTkzZjhlYXh4In0.883JgQoLDr0iIpu833xKGA';

    if (this.map) {
      this.map.remove(); // clean up previous map
    }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10.1658, 36.8065], // default to Tunis
      zoom: 10,
    });

    this.map.on('click', (event) => {
      const coords = event.lngLat;
      this.setMarker(coords);
    });
  }

  setMarker(coords: mapboxgl.LngLat): void {
    this.selectedLngLat = coords;

    if (this.marker) {
      this.marker.setLngLat(coords);
    } else {
      this.marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat(coords)
        .addTo(this.map);
    }
  }

  confirmLocation(): void {
    if (this.selectedLngLat) {
      console.log('Selected Coordinates:', this.selectedLngLat);
      // TODO: Emit or save the selected coordinates
      // Close the modal manually if needed
      const modalElement = document.getElementById('mapModal');
      // Ensure Bootstrap is imported
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement!);
      modalInstance?.hide();
    }
  }

  searchLocation(query: string): void {
    if (!query) return;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${(mapboxgl as any).accessToken}`
    )
      .then((res) => res.json())
      .then((data) => {
        const feature = data.features[0];
        if (feature) {
          const [lng, lat] = feature.center;
          this.map.flyTo({ center: [lng, lat], zoom: 14 });
          this.setMarker(new mapboxgl.LngLat(lng, lat));
        }
      });
  }
}
