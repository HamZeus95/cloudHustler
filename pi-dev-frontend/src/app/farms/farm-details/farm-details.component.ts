import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  farm: any;
  isLoading = true;
  farmArea: number | undefined; // Store the surface area here

  constructor(private route: ActivatedRoute, private farmService: FarmService) {}

  ngOnInit(): void {
    const farmId = this.route.snapshot.paramMap.get('id');
    if (farmId) {
      this.farmService.getFarmById(farmId).subscribe(data => {
        this.farm = data;
        this.isLoading = false;
      });
    }
  }
}
