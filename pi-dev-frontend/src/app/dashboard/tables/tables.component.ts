import { Component } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {
  isMenuVisible: boolean = false;

  // Méthode pour activer ou désactiver le menu
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

}
