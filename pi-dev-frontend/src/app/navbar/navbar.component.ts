import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  isMenuVisible: boolean = false;

  // Méthode pour activer ou désactiver le menu
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

}
