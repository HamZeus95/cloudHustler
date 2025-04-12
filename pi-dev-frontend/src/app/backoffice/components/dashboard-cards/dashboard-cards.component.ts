import { Component, Input } from '@angular/core';
import { Farm } from 'src/app/core/models/famrs/farm';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent {
  @Input() farms: any[] = [];
  @Input() crops: any[] = [];
  @Input() resources: any[] = []; // Added for Resources
  @Input() expenses: number = 0;  // Added for Expenses

}
