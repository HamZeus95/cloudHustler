import { Component, EventEmitter, Output } from '@angular/core';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';


@Component({
  selector: 'app-livraison',
  templateUrl: './livraisons.component.html',
  styleUrls: ['./livraisons.component.css']

})
export class LivraisonComponent {
  displayModal: boolean = false;

  closeDialog(): void {
    this.displayModal = false;
  }
  openDialog(livraison: Livraison) {
    this.selectedLivraison = livraison;
    this.displayModal = true;
  }
  selectedLivraison: Livraison | null = null; // <-- à ajouter

  @Output() livraisonSelected = new EventEmitter<Livraison>();

  livraisons: Livraison[] = [];
  newLivraison: Livraison = {
    id: 0,
    statut: '',
    dateCreation: '',
  };

  constructor(private livraisonService: LivraisonService) {
    this.loadLivraisons();
  }
  onCardClick(livraison: Livraison) {
    this.selectedLivraison = livraison; // Remplir le formulaire avec la livraison existante
    this.livraisonSelected.emit(livraison); // Émettre l'événement pour informer le parent (si besoin)
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
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN ATTENTE':
        return 'status-preparation';
      case 'PAYÉ':
        return 'status-expediee';
      case 'LIVRÉ':
        return 'status-livree';
      default:
        return '';
    }
  }
  

  supprimerLivraison(id: number) {
    this.livraisonService.delete(id).subscribe(
      () => {
        this.loadLivraisons(); // Recharger la liste des factures après la suppression
      },
      error => {
        console.error('Erreur lors de la suppression de la facture', error);
      }
    );
  }

}
