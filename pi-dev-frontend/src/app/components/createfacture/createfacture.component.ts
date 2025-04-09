import { Component } from '@angular/core';
import { Facture } from 'src/app/models/facture';
import { FactureService } from 'src/app/services/facture.service';

@Component({
  selector: 'app-createfacture',
  templateUrl: './createfacture.component.html',
  styleUrls: ['./createfacture.component.css']
})
export class CreatefactureComponent {
    constructor(private factureService: FactureService) {
    }
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
  ajouterFacture() {
    this.factureService.add(this.newFacture);
    this.newFacture = {
      id: 0,
      dateEmission: '',
      montantTotal: 0,
      statut: '',
      livraison: { id: 0, statut: '', dateCreation: '' }
    };
    //this.loadFactures();
  }

}
