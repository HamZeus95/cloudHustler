import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/core/models/livraison/facture';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { FactureService } from 'src/app/services/livraison/facture.service';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';

@Component({
  selector: 'app-details-livraison',
  templateUrl: './details-livraison.component.html',
  styleUrls: ['./details-livraison.component.css']
})
export class DetailsLivraisonComponent {


  @Input() livraison: Livraison | undefined;
  @Output() livraisonUpdated = new EventEmitter<Livraison>();
  
  isGeneratingPdf = false;
  isEditing = false;
  editForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private livraisonService: LivraisonService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.livraison) {
      this.livraison = {
        id: 0,
        dateCreation: new Date().toISOString(),
        dateLivraison: new Date().toISOString(),
        adresseLivraison: '',
        statut: '',
      };
    }

    const livraisonId = parseInt(this.route.snapshot.paramMap.get('id') || '0'); 
    if (livraisonId) {
      this.livraisonService.getById(livraisonId).subscribe({
        next: (livraison) => {
          this.livraison = livraison;
          this.initForm(); // Initialize form after getting data
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.snackBar.open('Erreur lors du chargement de la livraison', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.initForm(); // Initialize form with default data
    }
  }

  private initForm(): void {
    if (!this.livraison) return;
    
    this.editForm = this.fb.group({
      dateCreation: [this.livraison.dateCreation, Validators.required],
      dateLivraison: [this.livraison.dateLivraison, Validators.required],
      adresseLivraison: [this.livraison.adresseLivraison, [Validators.required]],
      statut: [this.livraison.statut, Validators.required]
    });
  }

  editFacture(): void {
    if (!this.livraison) return;
    
    this.editForm = this.fb.group({
      dateCreation: [this.livraison.dateCreation, Validators.required],
      dateLivraison: [this.livraison.dateLivraison, Validators.required],
      adresseLivraison: [this.livraison.adresseLivraison, [Validators.required]],
      statut: [this.livraison.statut, Validators.required]
    });
    
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset();
  }

  saveChanges(): void {
    if (!this.livraison || !this.editForm || this.editForm.invalid) {
      this.snackBar.open('Formulaire invalide', 'Fermer', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const updatedLivraison: Livraison = {
      ...this.livraison,
      dateCreation: this.editForm.get('dateCreation')?.value,
      dateLivraison: this.editForm.get('dateLivraison')?.value,
      adresseLivraison: this.editForm.get('adresseLivraison')?.value,
      statut: this.editForm.get('statut')?.value
    };

    this.livraisonService.update(updatedLivraison?.id!, updatedLivraison).subscribe({
      next: (result) => {
        this.livraison = {...result};
        this.isEditing = false;
        this.isSaving = false;
        this.livraisonUpdated.emit(this.livraison);
        this.snackBar.open('Livraison mise à jour avec succès', 'OK', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isSaving = false;
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }
}


