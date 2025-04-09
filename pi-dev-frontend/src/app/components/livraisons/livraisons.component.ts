import { Component } from '@angular/core';
import { Livraison } from 'src/app/models/livraison';
import { LivraisonService } from 'src/app/services/livraison.service';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraisons.component.html'
})
export class LivraisonComponent {
  livraisons: Livraison[] = [];
  newLivraison: Livraison = {
    id: 0,
    statut: '',
    dateCreation: '',
  };

  constructor(private livraisonService: LivraisonService) {
    this.loadLivraisons();
  }

  loadLivraisons() {
    this.livraisonService.getAll().subscribe((data: Livraison[]) => {
      this.livraisons = data;
    });
  }

  ajouterLivraison() {
    this.livraisonService.create(this.newLivraison);
    this.newLivraison = {
      id: 0,
      statut: '',
      dateCreation: '',
    };
    this.loadLivraisons();
  }

  supprimerLivraison(id: number) {
    this.livraisonService.delete(id);
    this.loadLivraisons();
  }
}
