import { Component, Input } from '@angular/core';
import { Farm } from 'src/app/core/models/famrs/farm';

@Component({
  selector: 'app-farm-table',
  templateUrl: './farm-table.component.html',
  styleUrls: ['./farm-table.component.css']
})
export class FarmTableComponent {
  showAddForm = false;
  newFarm: Farm = { 
    uuid_farm: '',  // Will be generated later
    name: '', 
    size: 0, 
    latitude: 0, 
    longitude: 0, 
    irrigation_type: '', 
    farmer: null, // Initialize as null or with an appropriate value
    resources: [], 
    crops: [], 
    tasks: [], 
    expenses: [] 
  };
  @Input() farms: Farm[] = [];
  expandedFarmId: string | null = null;
  irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'None'];

  toggleAddFarm() {
    console.log('Toggling add farm form...');
    this.showAddForm = !this.showAddForm;
  }

  saveNewFarm() {
    console.log('Saving new farm...', this.newFarm);
    if (this.newFarm.name && this.newFarm.size) {
      // Save logic (simulating saving farm data)
      this.newFarm.uuid_farm = Math.random().toString(36).substr(2, 9);  // Mocking a unique farm ID
      this.farms.push(this.newFarm);
      this.showAddForm = false; // Hide the form after adding
      this.newFarm = { 
        uuid_farm: '',  // Reset
        name: '', 
        size: 0, 
        latitude: 0, 
        longitude: 0, 
        irrigation_type: '', 
        farmer: null,  // Reset farmer as null
        resources: [], 
        crops: [], 
        tasks: [], 
        expenses: [] 
      };
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newFarm = { 
      uuid_farm: '', 
      name: '', 
      size: 0, 
      latitude: 0, 
      longitude: 0, 
      irrigation_type: '', 
      farmer: null,  // Reset farmer to null
      resources: [], 
      crops: [], 
      tasks: [], 
      expenses: [] 
    };
  }

  toggleDetails(farmId: string) {
    this.expandedFarmId = this.expandedFarmId === farmId ? null : farmId;
  }

  onDelete(farmId: string) {
    console.log('Deleting farm...', farmId);
    this.farms = this.farms.filter(farm => farm.uuid_farm !== farmId);
  }
}
