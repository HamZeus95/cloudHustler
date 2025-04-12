import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Crop } from 'src/app/core/models/famrs/crop';
import { Farm } from 'src/app/core/models/famrs/farm';
import { CropService } from 'src/app/core/services/crop.service';
import { FarmService } from 'src/app/core/services/farm.service';

@Component({
  selector: 'app-farm-table',
  templateUrl: './farm-table.component.html',
  styleUrls: ['./farm-table.component.css']
})
export class FarmTableComponent {
  @Input() farms: Farm[] = [];
  crops: Crop[] = [];

  @Output() deleteFarm = new EventEmitter<string>();
  constructor(
    private farmService: FarmService,
    private cropService: CropService
  ) {}
  ngOnInit(): void {
    this.loadFarms();
    this.loadCrops();
  }


  showAddForm = false;
  saving = false;
  expandedFarmId: string | null = null;
  newFarm: Omit<Farm, 'uuid_farm' | 'farmer'> = {
    name: '',
    size: 0,
    irrigation_type: '',
    latitude: 0,
    longitude: 0,
    resources: [],
    crops: [],
    tasks: [],
    expenses: []
  };
  irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Manual'];

  toggleAddFarm(): void {
    this.showAddForm = true;
  }

  saveNewFarm(): void {
    const { name, size, irrigation_type, latitude, longitude } = this.newFarm;

    if (!name || !size || !irrigation_type || latitude == null || longitude == null) {
      alert('Please fill in all required fields.');
      return;
    }

    this.saving = true;

    this.farmService.addFarm(this.newFarm).subscribe({
      next: (res: Farm) => {
        this.farms.push(res);
        this.cancelAdd();
        this.saving = false;
      },
      error: (err) => {
        console.error('Failed to add farm:', err);
        this.saving = false;
      }
    });
  }
   // ----------- Load Data -----------
   loadFarms(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        this.farms = farms;
      },
      error: (err) => {
        console.error('Error loading farms:', err);
      }
    });
  }

  loadCrops(): void {
    this.cropService.getCrops().subscribe({
      next: (crops) => {
        this.crops = crops;
      },
      error: (err) => {
        console.error('Error loading crops:', err);
      }
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newFarm = {

      name: '',
      size: 0,
      irrigation_type: '',
      latitude: 0,
      longitude: 0,
      resources: [],
      crops: [],
      tasks: [],
      expenses: []
    };
  }

  toggleDetails(farmId: string): void {
    this.expandedFarmId = this.expandedFarmId === farmId ? null : farmId;
  }

  // ----------- Delete Farm -----------
  onDelete(farmId: string): void {
    if (confirm('Are you sure you want to delete this farm?')) {
      this.farmService.deleteFarm(farmId).subscribe({
        next: () => {
          this.farms = this.farms.filter(farm => farm.uuid_farm !== farmId);
        },
        error: (err) => {
          console.error('Error deleting farm:', err);
        }
      });
    }
  }

}
