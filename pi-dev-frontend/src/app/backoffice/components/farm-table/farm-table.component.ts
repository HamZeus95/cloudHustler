import { Component, Input, AfterViewInit } from '@angular/core';
import { Farm } from 'src/app/core/models/famrs/farm';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-farm-table',
  templateUrl: './farm-table.component.html',
  styleUrls: ['./farm-table.component.css']
})
export class FarmTableComponent implements AfterViewInit {
  showAddForm = false;
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;

  @Input() farms: Farm[] = [];
  expandedFarmId: string | null = null;
  irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'None'];

  newFarm: Farm = this.initFarm();

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoibWRhMjAwMCIsImEiOiJjbTl0bW1sb2owMGY5MmxzOTkzZjhlYXh4In0.883JgQoLDr0iIpu833xKGA'; // 🔐 Replace with your token
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10, 34], // Tunisia default
      zoom: 5
    });

    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      this.newFarm.latitude = lat;
      this.newFarm.longitude = lng;

      if (this.marker) this.marker.remove();
      this.marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
    });
  }

  toggleAddFarm() {
    this.showAddForm = !this.showAddForm;
    setTimeout(() => {
      if (this.showAddForm) {
        this.initializeMap(); // Reinitialize map when form shows
      }
    });
  }

  saveNewFarm() {
    if (this.newFarm.name && this.newFarm.size) {
      this.newFarm.uuid_farm = Math.random().toString(36).substr(2, 9);
      this.farms.push({ ...this.newFarm });
      this.showAddForm = false;
      this.newFarm = this.initFarm();
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newFarm = this.initFarm();
  }

  toggleDetails(farmId: string) {
    this.expandedFarmId = this.expandedFarmId === farmId ? null : farmId;
  }

  onDelete(farmId: string) {
    this.farms = this.farms.filter(farm => farm.uuid_farm !== farmId);
  }

  private initFarm(): Farm {
    return {
      uuid_farm: '',
      name: '',
      size: 0,
      latitude: 0,
      longitude: 0,
      irrigation_type: '',
      farmer: null,
      resources: [],
      crops: [],
      tasks: [],
      expenses: []
    };
  }
}
