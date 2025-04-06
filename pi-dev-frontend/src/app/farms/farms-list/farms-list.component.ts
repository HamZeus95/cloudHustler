import { Component, OnInit } from '@angular/core';
import { FarmService } from '../services/farm.service';
import { Farm } from 'src/app/core/modules/farm';

@Component({
  selector: 'app-farms-list',
  templateUrl: './farms-list.component.html',
  styleUrls: ['./farms-list.component.css']
})
export class FarmsListComponent implements OnInit {

  farms: Farm[] = []; 

  constructor(private farmService: FarmService) {}

  ngOnInit(): void {
    this.farmService.getFarms().subscribe(farms => {
      this.farms = farms;
    });
   
  }
  deleteFarm(id: string): void {
    this.farmService.deleteFarm(id).subscribe(() => {
      this.farms = this.farms.filter(farm => farm.uuid_farm !== id);
    });
  }
  addFarm(farm: Farm): void {
    this.farmService.addFarm(farm).subscribe(newFarm => {
      this.farms.push(newFarm);
    });
  }
}
