import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Facture } from 'src/app/core/models/livraison/facture';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { FactureService } from 'src/app/services/livraison/facture.service';

@Component({
  selector: 'app-facture-client',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.css']
})
export class FactureClientComponent implements OnInit {
  factures: Facture[] = [];
    displayModal: boolean = false;
    selectedFacture: Facture | null = null;
      @Output() factureSelected = new EventEmitter<Livraison>();
    
  
  
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
    closeDialog(): void {
      this.displayModal = false; // Fermer la fenêtre modale
    }
  
    supprimerFacture(id: number): void {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
        this.factureService.delete(id).subscribe(() => {
          this.loadFactures(); // Recharge la liste après suppression
        });
      }
    }
    getStatutClass(statut: string): string {
      if (statut === 'Payée') {
        return 'status-paid';
      } else if (statut === 'En attente') {
        return 'status-pending';
      } else {
        return 'status-annulled';
      }
    }
  
    // Préparer la modification d'une facture
  
    // Mettre à jour une facture
    
    
  
    // Annuler la modification
    
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
   
      openDialog(facture: Facture) {
        this.selectedFacture = facture;
        this.displayModal = true;
      }
  }
  

