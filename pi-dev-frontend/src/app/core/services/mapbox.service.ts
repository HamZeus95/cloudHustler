import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  constructor() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibG91YXloMTEiLCJhIjoiY205cHFoejNqMGt6MjJqczRlN3JxYjl6aiJ9.r_vwTnPHgJfRZoE-YRKtNA';
  }

  createMap(container: string, center: [number, number] = [10.1815, 36.8065]): mapboxgl.Map {
    return new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 12
    });
  }

  addMarker(map: mapboxgl.Map, coordinates: [number, number], color: string = '#FF0000'): mapboxgl.Marker {
    return new mapboxgl.Marker({ color })
      .setLngLat(coordinates)
      .addTo(map);
  }

  flyTo(map: mapboxgl.Map, coordinates: [number, number]) {
    map.flyTo({
      center: coordinates,
      zoom: 14,
      essential: true
    });
  }
}