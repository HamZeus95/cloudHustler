import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonPredictionService } from 'src/app/core/services/livraison/livraison-prediction-service.service';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';

@Component({
  selector: 'app-livraison-client',
  templateUrl: './livraison-client.component.html',
  styleUrls: ['./livraison-client.component.css']
})
export class LivraisonClientComponent implements OnInit {
  displayModal: boolean = false;
  readonly userUuid = '01230000-0000-0000-0000-000000000000'; // Replace with actual UUID retrieval

  
    closeDialog(): void {
      this.displayModal = false;
    }
    navigateToMap(livraisonId: number) {
      this.router.navigate(['/frontoffice/suivrelivraison', livraisonId]);
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
      //dateEmission: '',
      //montantTotal: 0,
      statut: 'Pending',
      dateCreation: '',
      adresseLivraison: '',
      dateLivraison: '',
     // totalPrice: 0
    };
    etaMap: { [key: number]: number } = {}; // Stocker les ETA pour chaque livraison

    constructor(
      private livraisonService: LivraisonService,
      private router: Router,
      private predictionService: LivraisonPredictionService

    ) {
      this.loadLivraisons();
    }
    ngOnInit(): void {
      this.loadLivraisons();
    }
  
  
    onCardClick(livraison: Livraison) {
      this.selectedLivraison = livraison;
      this.livraisonSelected.emit(livraison);
      // Navigate to details page with the livraison id
      this.router.navigate(['/frontoffice/livraison-client-details', livraison.id]);
    }
  
    loadLivraisons() {
      // Assuming you store the UUID somewhere
      this.livraisonService.getLivraisonsByUser(this.userUuid).subscribe((data: Livraison[]) => {
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
            //dateEmission: '',
            //montantTotal: 0,
            statut: 'Pending',
            dateCreation: '',
            adresseLivraison: '',
            dateLivraison: '',
            //totalPrice: 0
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
      if (confirm("Are you sure you want to delete this delivery?")) {
        this.livraisonService.delete(id).subscribe(() => {
          this.loadLivraisons(); // Recharge la liste après suppression
        });
      }}
  
  /**
   * Récupère l'UUID de l'utilisateur à partir du token JWT stocké
   * @returns string UUID de l'utilisateur ou null si non trouvé
   */
  private getUserUuidFromToken(): string | null {
    try {
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('Aucun token trouvé');
        return null;
      }

      // Décoder le token (partie payload)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Format de token invalide');
        return null;
      }

      // Décoder la partie payload (2ème partie du token)
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Récupérer l'UUID depuis les claims du token
      const uuid = payload.uuid; // Ajuster selon la structure réelle de votre token
      
      if (!uuid) {
        console.error('UUID non trouvé dans le token');
        return null;
      }

      return uuid;

    } catch (error) {
      console.error('Erreur lors de l\'extraction de l\'UUID:', error);
      return null;
    }
  }
  // Exemple d'utilisation dans loadLivraisons():
  /* 
  loadLivraisons() {
    const userUuid = this.getUserUuidFromToken();
    if (!userUuid) {
      console.error('UUID non disponible');
      return;
    }
    this.livraisonService.getLivraisonsByUser(userUuid).subscribe((data: Livraison[]) => {
      this.livraisons = data;
    });
  }
  */
  navigateToSuivre(id: number) {
    this.router.navigate(['/frontoffice/suivrelivraison', id]);
  }
  predictDelay(livraison: Livraison) {
    this.predictionService.predictDelay(livraison).subscribe(
      (isDelayed) => {
        livraison.statut = isDelayed ? 'En retard' : livraison.statut;
      },
      (error) => {
        console.error('Erreur lors de la prédiction:', error);
      }
    );
  }
  predictEta(livraison: Livraison) {
    this.getDriverLocation().then((location) => {
      const driverLocation = `${location.latitude},${location.longitude}`;
      if (livraison.deliveryDriver) {
        livraison.deliveryDriver.positionLivreur = driverLocation; // Utiliser la position GPS comme origine
      }
  
      this.predictionService.predictEta(livraison).subscribe(
        (eta) => {
          this.etaMap[livraison.id] = eta; // Stocker l'ETA pour cette livraison
        },
        (error) => {
          console.error('Erreur lors de la prédiction de l\'ETA:', error);
        }
      );
    }).catch((error) => {
      console.error('Impossible de récupérer la position GPS:', error);
    });
  }
  getDriverLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Erreur lors de la récupération de la position GPS:', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}




