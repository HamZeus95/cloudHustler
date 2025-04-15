import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  isMenuVisible: boolean = false;

  // Méthode pour activer ou désactiver le menu
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

}
