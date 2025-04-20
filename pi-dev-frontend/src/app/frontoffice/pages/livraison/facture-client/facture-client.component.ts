import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Facture } from 'src/app/core/models/livraison/facture';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { FactureService } from 'src/app/core/services/livraison/facture.service';

@Component({
  selector: 'app-facture-client',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.css']
})
export class FactureClientComponent implements OnInit {
  factures: Facture[] = [];
    displayModal: boolean = false;
    selectedFacture: Facture | null = null;
      @Output() factureSelected = new EventEmitter<Facture>();
      readonly userUuid = '01230000-0000-0000-0000-000000000000'; // Replace with actual UUID retrieval

    
  
  
    newFacture: Facture = {
      id: 0,
      dateEmission: '',
      montantTotal: 0,
      statut: 'En attente', // Replace with a valid LivraisonStatus value
      livraison: {
        id: 0,
        statut: 'En attente', // Replace with a valid LivraisonStatus value
        dateCreation: '',
        adresseLivraison: '',
        dateLivraison: '',
       // dateEmission: '',
       // montantTotal: 0,
       // totalPrice: 0
      }
    };
  
    constructor(private factureService: FactureService,private router: Router) {
            
      
    }
    ngOnInit(): void {
      this.loadFactures();
    }
  
  
   
  
    // Récupérer toutes les factures depuis le service
    loadFactures() {
      this.factureService.getFacturesByUser(this.userUuid).subscribe((data: Facture[]) => {
              this.factures = data;
            });
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
   
    getStatutClass(statut: string): string {
      if (statut === 'Payée'|| statut === 'PAYÉ' || statut === 'PAYEE'|| statut === 'PAYÉE') {
        return 'status-paid';
      } else if (statut === 'En attente'|| statut === 'EN ATTENTE' || statut === 'ENATTENTE'|| statut === 'EN ATTENTE') {
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
        livraison: {
          id: 0, statut: 'En attente', dateCreation: '',
          adresseLivraison: '',
          dateLivraison: '',
          //dateEmission: '',
          //montantTotal: 0,
          //totalPrice: 0
        }
      };
    }
    /*marquerCommePayee(id: number): void {
      this.factureService.marquerCommePayee(id).subscribe({
        next: (message) => {
          alert(message); // Affiche le message de succès
        },
        error: (error) => {
          alert(error.error || "Erreur lors de la mise à jour de la facture");
        }
      });
    }*/

    marquerCommeAnnule(id: number): void {
      this.factureService.marquerCommeAnnule(id).subscribe({
        next: (message) => {
          alert("Facture annulée avec succès");
          this.loadFactures();
        },
        error: (error) => {
          alert(error.error || "Erreur lors de l'annulation de la facture");
        }
      });
    }
   
    openDialog(facture: Facture) {
        this.selectedFacture = facture;
        this.displayModal = true;
      }
      onCardClick(facture: Facture) {
        if (facture && facture.id) {
          this.selectedFacture = facture;
          this.factureSelected.emit(facture);
          this.router.navigate(['/frontoffice/facture-client-details', facture.id])
            .then(() => {
              console.log('Navigation successful');
            })
            .catch(error => {
              console.error('Navigation error:', error);
            });
        } else {
          console.error('Facture or facture.id is undefined');
        }
      }
    
  }


