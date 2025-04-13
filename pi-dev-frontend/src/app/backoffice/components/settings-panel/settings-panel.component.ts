import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.css']
})
export class SettingsPanelComponent {

  isPanelOpen = false;
  selectedColor: string = 'primary';
  sidenavType: string = 'white';
  isNavbarFixed: boolean = false;
  isDarkMode: boolean = false;

  togglePanel(): void {
    console.log('Panel toggled, isPanelOpen:', this.isPanelOpen);
    this.isPanelOpen = !this.isPanelOpen;
  }

  setSidebarColor(color: string): void {
    this.selectedColor = color;
    const sidenav = document.querySelector('.sidenav');
    if (sidenav) {
      sidenav.classList.remove('bg-gradient-primary', 'bg-gradient-dark', 'bg-gradient-info', 'bg-gradient-success', 'bg-gradient-warning', 'bg-gradient-danger');
      sidenav.classList.add(`bg-gradient-${color}`);
      console.log('Sidebar color set to:', color);
    } else {
      console.error('Sidenav element not found');
    }
  }

  setSidenavType(type: string): void {
    this.sidenavType = type;
    const sidenav = document.querySelector('.sidenav');
    if (sidenav) {
      sidenav.className = sidenav.className.replace(/bg-\w+/, type === 'white' ? 'bg-white' : 'bg-default');
      console.log('Sidenav type set to:', type);
    } else {
      console.error('Sidenav element not found');
    }
  }

  toggleNavbarFixed(): void {
    this.isNavbarFixed = !this.isNavbarFixed;
    const navbar = document.querySelector('.navbar-main');
    if (navbar) {
      navbar.classList.toggle('fixed-top', this.isNavbarFixed);
      console.log('Navbar fixed:', this.isNavbarFixed);
    } else {
      console.error('Navbar element not found');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-version', this.isDarkMode);
    console.log('Dark mode:', this.isDarkMode);
  }

}
