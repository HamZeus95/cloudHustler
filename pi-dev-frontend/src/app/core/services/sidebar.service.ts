import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Subject to emit toggle events
  private toggleSource = new Subject<void>();
  
  // Observable that components can subscribe to
  toggle$ = this.toggleSource.asObservable();
  
  constructor() { }
  
  // Method to trigger sidebar toggle
  toggleSidebar(): void {
    this.toggleSource.next();
  }
}