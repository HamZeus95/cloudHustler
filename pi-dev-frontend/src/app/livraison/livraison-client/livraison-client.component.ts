import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';

@Component({
  selector: 'app-livraison-client',
  templateUrl: './livraison-client.component.html',
  styleUrls: ['./livraison-client.component.css']
})
export class LivraisonClientComponent implements OnInit {
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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
      this.livraisonService.create(this.newLivraison).subscribe({
        next: (livraisonCreated) => {
          // Ajoute la nouvelle livraison directement au tableau
          this.livraisons = [...this.livraisons, livraisonCreated];
          // Reset le formulaire
          this.newLivraison = {
            id: 0,
            statut: '',
            dateCreation: '',
          };
        },
        error: (error) => {
          console.error('Erreur lors de la création de la livraison:', error);
        }
      });
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
      if (confirm("Êtes-vous sûr de vouloir supprimer cette livraison ?")) {
        this.livraisonService.delete(id).subscribe(() => {
          this.loadLivraisons(); // Recharge la liste après suppression
        });
      }}
  
  }
  
  


