import { Component, OnInit } from '@angular/core';
import { Facture } from 'src/app/models/facture';
import { FactureService } from 'src/app/services/facture.service';

@Component({
  selector: 'app-facture',
  templateUrl: './factures.component.html'
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  newFacture: Facture = {
    id: 0,
    dateEmission: '',
    montantTotal: 0,
    statut: '',
    livraison: {
      id: 0,
      statut: '',
      dateCreation: ''
    }
  };
  editFacture: Facture | null = null; // Pour éditer une facture

  constructor(private factureService: FactureService) {}

  ngOnInit() {
    this.loadFactures();
  }

  // Récupérer toutes les factures depuis le service
  loadFactures() {
    this.factureService.getAll().subscribe(
      (data: Facture[]) => {
        this.factures = data;
      },
      error => {
        console.error('Erreur lors de la récupération des factures', error);
      }
    );
  }

  // Ajouter une nouvelle facture
  ajouterFacture() {
    this.factureService.add(this.newFacture).subscribe(
      () => {
        this.loadFactures(); // Recharger la liste des factures après l'ajout
        this.resetNewFacture(); // Réinitialiser le formulaire
      },
      error => {
        console.error('Erreur lors de l\'ajout de la facture', error);
      }
    );
  }

  // Supprimer une facture
  supprimerFacture(id: number) {
    this.factureService.delete(id).subscribe(
      () => {
        this.loadFactures(); // Recharger la liste des factures après la suppression
      },
      error => {
        console.error('Erreur lors de la suppression de la facture', error);
      }
    );
  }

  // Préparer la modification d'une facture
  preparerModification(facture: Facture) {
    this.editFacture = { ...facture }; // Créer une copie de la facture pour édition
  }

  // Mettre à jour une facture
  mettreAJourFacture() {
    if (this.editFacture) {
      // Vérifier que l'ID de la facture est défini
      if (this.editFacture.id !== undefined && this.editFacture.id !== null) {
        // Appel à la méthode du service pour mettre à jour la facture
        this.factureService.update(this.editFacture.id, this.editFacture).subscribe(
          () => {
            // Réinitialiser la facture en cours d'édition
            this.editFacture = null;
            // Recharger la liste des factures après mise à jour
            this.loadFactures();
          },
          error => {
            console.error('Erreur lors de la mise à jour de la facture', error);
          }
        );
      } else {
        console.error('Erreur : l\'ID de la facture est indéfini');
      }
    }
  }
  

  // Annuler la modification
  annulerModification() {
    this.editFacture = null;
  }

  // Réinitialiser le formulaire de création de facture
  resetNewFacture() {
    this.newFacture = {
      id: 0,
      dateEmission: '',
      montantTotal: 0,
      statut: '',
      livraison: { id: 0, statut: '', dateCreation: '' }
    };
  }
  marquerCommePayee(id: number): void {
    this.factureService.marquerCommePayee(id).subscribe({
      next: (message) => {
        alert(message); // Affiche le message de succès
      },
      error: (error) => {
        alert(error.error || "Erreur lors de la mise à jour de la facture");
      }
    });
  }
}
