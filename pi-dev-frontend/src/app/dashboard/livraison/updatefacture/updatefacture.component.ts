import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/services/livraison/facture.service';
import { PrimeIcons } from 'primeng/api';


@Component({
  selector: 'app-updatefacture',
  templateUrl: './updatefacture.component.html',
  styleUrls: ['./updatefacture.component.css']
})
export class UpdatefactureComponent {
  factureForm!: FormGroup;
  factureId!: number;
  isModalOpen: boolean = false; // Contrôle l'ouverture de la fenêtre modale
  @Input() facture: any; // Replace 'any' with the appropriate type if available
  @Output() close = new EventEmitter<void>();
  


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private factureService: FactureService, // Service pour gérer les factures
    private router: Router
  ) {}

  ngOnInit(): void {
    this.factureForm = this.fb.group({
      id: [null],
      dateEmission: ['', Validators.required],
      montantTotal: [null, [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
      //livraison: [null] // Optionnel si tu veux lier une livraison
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.factureId = idParam ? +idParam : 0; // Récupérer l'ID de la facture depuis l'URL ou utiliser 0 par défaut
    //this.loadFacture(); // Charger la facture dans le formulaire
    this.isModalOpen = true; // Ouvrir la fenêtre modale
  }

  /*loadFacture(): void {
    this.factureService.getById(this.factureId).subscribe((facture: Facture) => {
      if (facture) {
        this.factureForm.patchValue(facture); // Remplir le formulaire avec les données de la facture
      } else {
        console.error('Facture introuvable.');
      }
    }, error => {
      console.error('Erreur lors du chargement de la facture:', error);
    });
  }*/
  

  
  onSubmit() {
    if (this.factureForm.valid) {
      const updatedData = this.factureForm.value;
  
      if (this.facture?.id) {
        updatedData.id = this.facture.id;
  
        updatedData.dateEmission = this.formatDateToLocalDateTime(updatedData.dateEmission);
  
        this.factureService.update(this.facture.id, updatedData).subscribe(
          (response) => {
            console.log('Facture mise à jour avec succès', response);
            this.close.emit(); // Ferme la fenêtre modale
  
            // Actualiser la liste des factures
            this.router.navigate(['/factures']); // Ou un autre mécanisme pour rafraîchir la liste
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la facture:', error);
          }
        );
      } else {
        console.error('ID de la facture manquant pour la mise à jour.');
      }
    }
  }
  
  
  formatDateToLocalDateTime(date: string): string {
    // Convertit la date en format LocalDateTime (yyyy-MM-ddTHH:mm:ss)
    return `${date}`; // Tu peux ajuster l'heure si nécessaire, ici on fixe à 00:00:00
  }
  

  onCancel(): void {
    this.isModalOpen = false; // Fermer la modale si l'utilisateur annule
    this.router.navigate(['/factures']);
  }
}