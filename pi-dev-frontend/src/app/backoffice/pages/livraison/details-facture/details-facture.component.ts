import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facture } from 'src/app/core/models/livraison/facture';
import { HttpClient } from '@angular/common/http';
import { FactureService } from 'src/app/core/services/livraison/facture.service';

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
          console.error('Error while loading:', error);
          this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.initForm(); // Initialize form with default data
    }
  }

  private initForm(): void {
    if (!this.facture) return;
    const dateCreation = new Date(this.facture?.livraison?.dateCreation ?? new Date());
    this.creationDate = dateCreation.toISOString().split('T')[0];
    
    this.editForm = this.fb.group({
      dateEmission: [this.facture?.livraison?.dateCreation, [Validators.required]],
      montantTotal: [this.facture.montantTotal, [
        Validators.required,
        Validators.min(0)
      ]],
      statut: [this.facture.statut, Validators.required]
    });
  }

  creationDate!: string; // format 'yyyy-MM-dd'
today: string = new Date().toISOString().split('T')[0];
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
      this.snackBar.open('Invalid form', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const updatedFacture: Facture = {
      ...this.facture,
      dateEmission: this.editForm.get('dateEmission')?.value,
      montantTotal: this.editForm.get('montantTotal')?.value,
      statut: this.editForm.get('statut')?.value // Will be one of: 'PENDING', 'PAID', 'CANCELLED'
    };

    this.factureService.update(updatedFacture?.id!, updatedFacture).subscribe({
      next: (result) => {
        this.facture = {...result};
        this.isEditing = false;
        this.isSaving = false;
        this.factureUpdated.emit(this.facture);
        this.snackBar.open('Invoice updated successfully', 'OK', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error while updating:', error);
        this.isSaving = false;
        this.snackBar.open('Error while updating invoice', 'Close', { duration: 3000 });
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
  isNavbarVisible = false;
  hideTimeout: any;

  showNavbar() {
    clearTimeout(this.hideTimeout);
    this.isNavbarVisible = true;
  }

  hideNavbar() {
    // Délai avant de cacher pour éviter les disparitions soudaines
    this.hideTimeout = setTimeout(() => {
      this.isNavbarVisible = false;
    }, 300); // 300ms de délai
  }

  // Optionnel: Cacher quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-side-bar') && !target.closest('.hover-trigger-area')) {
      this.hideNavbar();
    }
  }
}

