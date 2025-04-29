import { Ressource } from './../../../core/models/famrs/resource';
import { Expense } from 'src/app/core/models/famrs/expense';
import { Component, OnInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { Crop } from 'src/app/core/models/famrs/crop';
import { Farm } from 'src/app/core/models/famrs/farm';
import { CropService } from 'src/app/core/services/farm-managment/crop.service';
import { FarmService } from 'src/app/core/services/farm-managment/farm.service';
import { RessourceService } from 'src/app/core/services/farm-managment/ressource.service';
import { ExpenseService } from 'src/app/core/services/farm-managment/expense.service';

@Component({
  selector: 'app-farm-managment',
  templateUrl: './farm-managment.component.html',
  styleUrls: ['./farm-managment.component.css']
})
export class FarmManagmentComponent implements OnInit {
  farms: Farm[] = [];
  crops: Crop[] = [];
  expenses: Expense[] = [];
  ressources: Ressource[] = [];
  
    showAddForm = false;
    saving = false;
  
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
  
    irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Pivot', 'None'];
  
    constructor(
      private farmService: FarmService,
      private cropService: CropService,
      private resourceService: RessourceService,
      private expenseService: ExpenseService
    ) {}
  
    ngOnInit(): void {
      this.loadFarms();
      this.loadCrops();
      this.loadResources();
      this.loadExpenses();
    }
  
    // ngAfterViewInit(): void {
    //   this.initChart();
    // }
  
    // ----------- Add Farm Logic -----------
    // toggleAddFarm(): void {
    //   this.showAddForm = true;
    // }
  
    // cancelAdd(): void {
    //   this.showAddForm = false;
    //   this.newFarm = {
  
    //     name: '',
    //     size: 0,
    //     irrigation_type: '',
    //     latitude: 0,
    //     longitude: 0,
    //     resources: [],
    //     crops: [],
    //     tasks: [],
    //     expenses: []
    //   };
    // }
  
    // saveNewFarm(): void {
    //   const { name, size, irrigation_type, latitude, longitude } = this.newFarm;
  
    //   if (!name || !size || !irrigation_type || latitude == null || longitude == null) {
    //     alert('Please fill in all required fields.');
    //     return;
    //   }
  
    //   this.saving = true;
  
    //   this.farmService.addFarm(this.newFarm).subscribe({
    //     next: (res: Farm) => {
    //       this.farms.push(res);
    //       this.cancelAdd();
    //       this.saving = false;
    //     },
    //     error: (err) => {
    //       console.error('Failed to add farm:', err);
    //       this.saving = false;
    //     }
    //   });
    // }
  
    // ----------- Chart Logic -----------
    // initChart(): void {
    //   Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
  
    //   const ctx = document.getElementById('chart-line') as HTMLCanvasElement;
    //   if (!ctx) return;
  
    //   const chartCtx = ctx.getContext('2d');
    //   if (!chartCtx) return;
  
    //   const gradientFarms = chartCtx.createLinearGradient(0, 230, 0, 50);
    //   gradientFarms.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    //   gradientFarms.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    //   gradientFarms.addColorStop(0, 'rgba(94, 114, 228, 0)');
  
    //   const gradientCrops = chartCtx.createLinearGradient(0, 230, 0, 50);
    //   gradientCrops.addColorStop(1, 'rgba(72, 208, 176, 0.2)');
    //   gradientCrops.addColorStop(0.2, 'rgba(72, 208, 176, 0.0)');
    //   gradientCrops.addColorStop(0, 'rgba(72, 208, 176, 0)');
  
    //   new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //       labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    //       datasets: [
    //         {
    //           label: 'Farms Count',
    //           data: [10, 15, 20, 25, 35, 45, 60],
    //           backgroundColor: gradientFarms,
    //           borderColor: '#5e72e4',
    //           borderWidth: 3,
    //           tension: 0.4,
    //           fill: true
    //         },
    //         {
    //           label: 'Crops Count',
    //           data: [5, 10, 12, 18, 25, 40, 50],
    //           backgroundColor: gradientCrops,
    //           borderColor: '#48d0b0',
    //           borderWidth: 3,
    //           tension: 0.4,
    //           fill: true
    //         }
    //       ]
    //     },
    //     options: {
    //       responsive: false,
    //       plugins: {
    //         legend: {
    //           display: true,
    //           labels: {
    //             color: '#333',
    //             font: {
    //               size: 14
    //             }
    //           }
    //         },
    //         tooltip: {
    //           enabled: true
    //         }
    //       },
    //       scales: {
    //         y: {
    //           title: {
    //             display: true,
    //             text: 'Count',
    //             color: '#666'
    //           },
    //           ticks: {
    //             color: '#666'
    //           },
    //           grid: {
    //             color: '#eee'
    //           }
    //         },
    //         x: {
    //           title: {
    //             display: true,
    //             text: 'Month',
    //             color: '#666'
    //           },
    //           ticks: {
    //             color: '#666'
    //           },
    //           grid: {
    //             display: false
    //           }
    //         }
    //       }
    //     }
    //   });
    // }
  
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

    loadResources(): void {
      this.resourceService.getRessources().subscribe({
        next: (ressources) => {
          this.ressources = ressources;
        },
        error: (err) => {
          console.error('Error loading resources:', err);
        }
      });
    }
    loadExpenses(): void {
      this.expenseService.getExpenses().subscribe({
        next: (expenses) => {
          this.expenses = expenses;
        },
        error: (err) => {
          console.error('Error loading expenses:', err);
        }
      });
    }
    get totalExpenses(): number {
      return this.expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);
    }
  
    // ----------- Delete Farm -----------
    // onDelete(farmId: string): void {
    //   if (confirm('Are you sure you want to delete this farm?')) {
    //     this.farmService.deleteFarm(farmId).subscribe({
    //       next: () => {
    //         this.farms = this.farms.filter(farm => farm.uuid_farm !== farmId);
    //       },
    //       error: (err) => {
    //         console.error('Error deleting farm:', err);
    //       }
    //     });
    //   }
    // }
  
  
    //Show Farm Details 
    // expandedFarmId: string | null = null;
    // toggleDetails(farmId: string): void {
    //   this.expandedFarmId = this.expandedFarmId === farmId ? null : farmId;
    // }
  
  

}
