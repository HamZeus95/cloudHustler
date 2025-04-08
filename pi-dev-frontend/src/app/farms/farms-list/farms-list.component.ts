import { Component, OnInit } from '@angular/core';
import { FarmService } from '../services/farm.service';
import { Farm } from 'src/app/core/modules/farm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-farms-list',
  templateUrl: './farms-list.component.html',
  styleUrls: ['./farms-list.component.css']
})
export class FarmsListComponent implements OnInit {
  farms: Farm[] = [];

  constructor(
    private farmService: FarmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFarms();
  }

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