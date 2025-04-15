import { Component } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  isMenuVisible: boolean = false;

  // Méthode pour activer ou désactiver le menu
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

}
