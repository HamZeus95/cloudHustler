import { Component, OnInit, Input } from '@angular/core';
import { SuiviLivraison } from 'src/app/models/suivilivraison';
import { SuiviLivraisonService } from 'src/app/services/suivilivraison.service';

@Component({
  selector: 'app-suivi-livraison',
  templateUrl: './suivilivraisons.component.html',
})
export class SuiviLivraisonComponent implements OnInit {
  @Input() livraisonId: number = 0;  // Assure-toi que c'est initialisé à une valeur par défaut
  suivis: SuiviLivraison[] = [];

  constructor(private suiviLivraisonService: SuiviLivraisonService) {}

  ngOnInit(): void {
    if (this.livraisonId) {
      this.loadSuivis();
    }
  }

  loadSuivis(): void {
    this.suiviLivraisonService.getHistoriqueByLivraisonId(this.livraisonId).subscribe((data: SuiviLivraison[]) => {
      this.suivis = data;
    });
  }
}
