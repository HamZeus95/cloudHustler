import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';

@Component({
  selector: 'app-livraison-clientdetails',
  templateUrl: './livraison-clientdetails.component.html',
  styleUrls: ['./livraison-clientdetails.component.css']
})
export class LivraisonClientdetailsComponent implements OnInit {
  livraisonDetails: any;

  constructor(
    private route: ActivatedRoute,
    private livraisonService: LivraisonService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.livraisonService.getLivraisonsById(id).subscribe({
      next: (data) => {
        console.log('Données reçues:', data); // Pour déboguer
        this.livraisonDetails = data;
        
        // Vérifier si le livreur existe
        if (!this.livraisonDetails.deliveryDriver) {
          console.warn('Pas de livreur assigné à cette livraison');
        } else {
          console.log('Données du livreur:', this.livraisonDetails.deliveryDriver);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    });
  }

  annulerLivraison() {
    if (this.livraisonDetails && this.livraisonDetails.statut.toUpperCase() === 'EN ATTENTE') {
      // Créer une copie de l'objet avec le nouveau statut
      const updatedLivraison = { ...this.livraisonDetails, statut: 'ANNULÉE' };
      
      // Utiliser la méthode update existante
      this.livraisonService.update(this.livraisonDetails.id, updatedLivraison).subscribe({
        next: (response) => {
          this.livraisonDetails = response;
          alert('La livraison a été annulée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          alert('Erreur lors de l\'annulation de la livraison');
        }
      });
    } else {
      alert('Impossible d\'annuler cette livraison. Elle n\'est pas en attente.');
    }
  }
}
