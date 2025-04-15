import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import { Facture } from 'src/app/core/models/livraison/facture';
import { FactureService } from 'src/app/services/livraison/facture.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details-facture',
  templateUrl: './details-facture.component.html',
  styleUrls: ['./details-facture.component.css']
})
export class DetailsFactureComponent {
  @Input() facture: Facture | undefined;
  @Output() factureUpdated = new EventEmitter<Facture>();
  
  isGeneratingPdf = false;
  isEditing = false;
  editForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private factureService: FactureService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.facture) {
      this.facture = {
        id: 0,
        dateEmission: new Date().toISOString(),
        montantTotal: 0,
        statut: '',
        livraison: undefined
      };
    }

    const factureId = parseInt(this.route.snapshot.paramMap.get('id') || '0'); 
    if (factureId) {
      this.factureService.getById(factureId).subscribe({
        next: (facture) => {
          this.facture = facture;
          this.initForm(); // Initialize form after getting data
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.snackBar.open('Erreur lors du chargement de la facture', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.initForm(); // Initialize form with default data
    }
  }

  private initForm(): void {
    if (!this.facture) return;
    
    this.editForm = this.fb.group({
      dateEmission: [this.facture.dateEmission, Validators.required],
      montantTotal: [this.facture.montantTotal, [
        Validators.required,
        Validators.min(0)
      ]],
      statut: [this.facture.statut, Validators.required]
    });
  }

  editFacture(): void {
    if (!this.facture) return;
    
    this.editForm = this.fb.group({
      dateEmission: [this.facture.dateEmission, Validators.required],
      montantTotal: [this.facture.montantTotal, [Validators.required, Validators.min(0)]],
      statut: [this.facture.statut, Validators.required]
    });
    
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset();
  }

  saveChanges(): void {
    if (!this.facture || !this.editForm || this.editForm.invalid) {
      this.snackBar.open('Formulaire invalide', 'Fermer', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const updatedFacture: Facture = {
      ...this.facture,
      dateEmission: this.editForm.get('dateEmission')?.value,
      montantTotal: this.editForm.get('montantTotal')?.value,
      statut: this.editForm.get('statut')?.value
    };

    this.factureService.update(updatedFacture?.id!, updatedFacture).subscribe({
      next: (result) => {
        this.facture = {...result};
        this.isEditing = false;
        this.isSaving = false;
        this.factureUpdated.emit(this.facture);
        this.snackBar.open('Facture mise à jour avec succès', 'OK', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isSaving = false;
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }
  generatePDF() {
    // Sélectionnez uniquement la partie à convertir en PDF (excluez la sidebar et les boutons)
    const pdfContent = document.querySelector('.details-facture-container')?.outerHTML || '';

    // Envoyez le HTML au backend Spring Boot
    this.http.post('http://localhost:8090/tpfoyer/generate-pdf', { html: pdfContent }, { responseType: 'blob' })
      .subscribe((pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture_${this.facture?.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}

