import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() openSettingsEvent = new EventEmitter<void>();
  searchQuery = '';

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    // Implement search logic
  }

  signIn(): void {
    // Implement sign-in logic
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  openSettings(): void {
    this.openSettingsEvent.emit();
  }

}