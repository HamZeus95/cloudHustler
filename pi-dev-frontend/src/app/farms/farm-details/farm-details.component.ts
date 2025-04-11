import { Component, Input } from '@angular/core';
import { Farm } from 'src/app/core/models/famrs/farm';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent {
  @Input() farm!: Farm;

  
  onAddCrop(): void {
    console.log('Add crop clicked for', this.farm.name);
    // You could emit an event to parent here later if needed
  }
}
