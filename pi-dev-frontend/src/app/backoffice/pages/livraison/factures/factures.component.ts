import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Facture } from 'src/app/core/models/livraison/facture';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FactureService } from 'src/app/core/services/livraison/facture.service';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from 'src/app/core/error-dialog/error-dialog.component';
import { CustomValidators } from 'src/app/core/validators/custom.validators';

@Component({
  selector: 'app-facture',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css'],
  providers: [DatePipe]
})
export class FactureComponent implements OnInit {
  isModalOpen = false;
  percentages = {
    payee: 0,
    enAttente: 0,
    annulee: 0
  };
  factures: Facture[] = [];
  filteredFactures: Facture[] = [];
  displayModal: boolean = false;
  selectedFacture: Facture | null = null;
    @Output() factureSelected = new EventEmitter<Livraison>();
  
    currentPage = 1;
    itemsPerPage = 5; // Par exemple, 5 factures par page
    

  newFacture: Facture = {
    id: 0,
    dateEmission: '',
    montantTotal: 0,
    statut: 'Pending',
    livraison: {
      id: 0,
      statut: 'Pending',
      dateCreation: '',
      adresseLivraison: '',
      dateLivraison: '',
      //dateEmission: '',
      //montantTotal: 0,
      //totalPrice: 0
    }
  };
  counts = {
    payee: 0,
    enAttente: 0,
    annulee: 0,
    total: 0
  };
  
  isLoading = true;
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => {
              const numA = typeof a === 'number' ? a : 0;
              const numB = typeof b === 'number' ? b : 0;
              return numA + numB;
            }, 0);
            const percentage = Math.round((Number(value) / Number(total)) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  public pieChartData: ChartConfiguration['data'] = {
    labels: ['Paid', 'Pending', 'Cancelled'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        '#28a745', // Vert pour payées
        '#ffc107', // Jaune pour en attente
        '#dc3545'  // Rouge pour annulées
      ],
      hoverBackgroundColor: [
        '#218838',
        '#e0a800',
        '#c82333'
      ]
    }]
  };

  public pieChartType: ChartType = 'pie';

  constructor( private fb: FormBuilder,
    private factureService: FactureService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private livraisonService: LivraisonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.filteredFactures = [];
    this.initializeForm();
  }

  private dateEmissionMatchesCreationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
  
      const livraison = control.parent.get('livraison')?.value;
      if (!livraison?.dateCreation) return null;
  
      const dateEmission = new Date(control.value).toDateString();
      const dateCreation = new Date(livraison.dateCreation).toDateString();
  
      return dateEmission === dateCreation ? null : { dateMismatch: true };
    };
  }

  private initializeForm(): void {
    this.factureForm = this.fb.group({
      dateEmission: ['', [
        Validators.required,
        this.dateEmissionMatchesCreationValidator()
      ]],
      montantTotal: ['', Validators.required],
      statut: ['Pending', [
        Validators.required,
        CustomValidators.validStatutFacture1()
      ]],
      livraison: [null, Validators.required]
    }, { validators: this.montantTotalMatchLivraisonValidator() });
    

    // Update montantTotal when livraison changes
    this.factureForm.get('livraison')?.valueChanges.subscribe((livraison) => {
      const totalPrice = livraison?.ordre?.order.orderItems.product.price * livraison?.ordre?.order.orderItemsproduct.quantity || 0;
      this.factureForm.get('montantTotal')?.setValue(totalPrice, { emitEvent: false });
      console.log('Montant total mis à jour:', totalPrice);
    });
  }
  
  searchTerm: string = '';

  filterFactures(value: string): void {
    if (!value) {
      this.filteredFactures = [...this.factures];
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    this.filteredFactures = this.factures.filter(facture => 
      this.isMatchingSearch(facture, searchTerm)
    );
  }

  private isMatchingSearch(facture: Facture, searchTerm: string): boolean {
    return [
      facture?.id?.toString(),
      facture?.statut?.toLowerCase(),
      facture?.montantTotal?.toString(),
      this.datePipe.transform(facture?.dateEmission, 'dd/MM/yyyy'),
      facture?.livraison?.id?.toString()
    ].some(value => value?.includes(searchTerm));
  }

  // Récupérer toutes les factures depuis le service
  loadFactures() {
    this.factureService.getAll().subscribe(
      (data: Facture[]) => {
        this.factures = data;
        this.filteredFactures = data; // Initialiser filteredFactures
      },
      error => {
        console.error('Error while retrieving invoices', error);
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
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.factureService.delete(id).subscribe({
          next: () => {
            this.loadFactures(); // ✅ Recharger les factures
        this.loadStats();    // ✅ Recharger les statistiques
          },
          error: (err) => console.error('Erreur suppression:', err)
        });
      }
    }
  

  resetNewFacture() {
    this.newFacture = {
      id: 0,
      dateEmission: '',
      montantTotal: 0,
      statut: '',
      livraison: {
        id: 0, statut: 'Pending', dateCreation: '',
        adresseLivraison: '',
        dateLivraison: '',
        //dateEmission: '',
        //montantTotal: 0,
        //totalPrice: 0
      }
    };
  }
  
 
    openDialog(facture: Facture) {
      this.selectedFacture = facture;
      this.displayModal = true;
    }
    

  loadStats() {
    this.factureService.getFacturesCountByStatus().subscribe({
      next: (counts) => {
        // Mettre à jour les données du graphique
        this.pieChartData.datasets[0].data = [
          counts.payee,
          counts.enAttente,
          counts.annulee
        ];
        
        // Mettre à jour les pourcentages affichés
        this.updatePercentages(counts);
      },
      error: (err) => console.error(err)
    });
  }

  updatePercentages(counts: any) {
    const total = counts.total || 1; // Éviter la division par zéro
    
    this.percentages = {
      payee: Math.round((counts.payee / total) * 100),
      enAttente: Math.round((counts.enAttente / total) * 100),
      annulee: Math.round((counts.annulee / total) * 100)
    };
  }
  public miniChartType: ChartType = 'doughnut';

public miniChartOptions: ChartConfiguration['options'] = {
  responsive: false,
  //cutoutPercentage: 75,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
};

getMiniChartData(count: number): ChartConfiguration['data'] {
  const remaining = this.counts.total - count;
  return {
    labels: ['Statut', 'Reste'],
    datasets: [
      {
        data: [count, remaining > 0 ? remaining : 0]
      }
    ]
  };
}
factureForm!: FormGroup;
  isEditMode = false;
  id!: number;
  livraisons: Livraison[] = [];

  ngOnInit(): void {
    this.loadFactures();
    this.factureService.getFacturesCountByStatus().subscribe({
      next: (data) => {
        this.counts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
    this.loadStats();
   

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = params['id'];
        this.factureService.getById(this.id).subscribe(data => {
          this.factureForm.patchValue(data);
        });
      }
    });

    this.loadLivraisons();
  }

  private loadLivraisons() {
    // Fetch all factures to determine which livraisons are already associated
    this.factureService.getAll().subscribe({
      next: (factures) => {
        // Create a set of livraison IDs that are already associated with factures
        const associatedLivraisonIds = new Set(factures.map(facture => facture.livraison?.id));

        // Fetch all livraisons and filter out the ones that are already associated
        this.livraisonService.getAll().subscribe({
          next: (livraisons) => {
            this.livraisons = livraisons.filter(livraison => !associatedLivraisonIds.has(livraison.id));
          },
          error: (error) => console.error('Erreur chargement livraisons:', error)
        });
      },
      error: (error) => console.error('Erreur chargement factures:', error)
    });
  }

  // ...existing code...
onSubmit(): void {
  if (this.factureForm.invalid) {
    let errorMessage = 'Validation errors:\n';
    
    const controls = this.factureForm.controls;
    for (const key in controls) {
      if (controls[key].invalid) {
        switch (key) {
          case 'dateEmission':
            if (controls[key].errors?.['required']) errorMessage += '- Issue date is required\n';
            if (controls[key].errors?.['futureDate']) errorMessage += '- Issue date cannot be in the future\n';
            break;
          case 'montantTotal':
            if (controls[key].errors?.['required']) errorMessage += '- Total amount is required\n';
            if (controls[key].errors?.['min']) errorMessage += '- Total amount must be positive\n';
            break;
          case 'livraison':
            if (controls[key].errors?.['required']) errorMessage += '- Delivery not selected\n';
            if (controls[key].errors?.['invalidDate']) errorMessage += '- Invalid delivery date\n';
            break;
        }
      }
    }
// ...existing code...

      this.dialog.open(ErrorDialogComponent, {
        width: '400px',
        data: { message: errorMessage }
      });
      return;
    }

    // Création de la facture
    this.factureService.add(this.factureForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Invoice created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.closeModal();
        this.loadFactures();
      },
      error: (error) => {
        let errorMsg = 'Error during creation: ';
        if (error.error?.message) {
          errorMsg += error.error.message;
        } else {
          errorMsg += 'An unexpected error occurred';
        }
        
        this.dialog.open(ErrorDialogComponent, {
          width: '400px',
          data: { message: errorMsg }
        });
      }
    });
  }

  onCancel(): void {
    this.factureForm.reset();
  }
  openModal() {
    this.isModalOpen = true; 
    console.log('Ouverture de la modale');
    // Ouvre la fenêtre modale
  }

  closeModal() {
    this.isModalOpen = false; // Ferme la fenêtre modale
  }
  get paginatedFactures(): Facture[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    /* console.log('Affichage de', start, 'à', end);
    console.log("Nombre de factures filtrées:", this.filteredFactures.length);*/

    return this.filteredFactures.slice(start, end);
  }
  
  get totalPages(): number[] {
    const total = Math.ceil(this.filteredFactures.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  Math = Math;

  // Validateur pour vérifier que la date n'est pas dans le futur
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      const inputDate = new Date(control.value);
      return inputDate > today ? { futureDate: true } : null;
    };
  }

  // Validateur pour vérifier la relation entre date d'émission et date de livraison
  dateSequenceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const dateEmission = new Date(control.parent.get('dateEmission')?.value);
      const livraison = control.parent.get('livraison')?.value;

      if (!dateEmission || !livraison?.dateLivraison) {
        return null;
      }

      const dateLivraison = new Date(livraison.dateLivraison);
      return dateEmission > dateLivraison ? { invalidDate: true } : null;
    };
  }

  initForm() {
    this.factureForm = this.fb.group({
      dateEmission: ['', [Validators.required, this.futureDateValidator()]],
      livraison: ['', [Validators.required, this.dateSequenceValidator()]],
      montantTotal: ['', [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required]
    });

    // Réagir aux changements de la date d'émission pour revalider la livraison
    this.factureForm.get('dateEmission')?.valueChanges.subscribe(() => {
      this.factureForm.get('livraison')?.updateValueAndValidity();
    });
  }
  private dateValidators(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
    
        const selectedDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
      
    
        // Vérifie si la date dépasse 5 jours dans le futur
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 5); // Ajoute 5 jours
        maxDate.setHours(23, 59, 59, 999); // Fin de journée
    
        if (selectedDate > maxDate) {
          return { maxFutureDays: true }; // Notez le nom de l'erreur
        }
    
        return null;
      };
    }
    private montantTotalMatchLivraisonValidator(): ValidatorFn {
      return (group: AbstractControl): ValidationErrors | null => {
        const montantTotal = group.get('montantTotal')?.value;
        const livraison = group.get('livraison')?.value;
    
        const totalPrice = livraison?.ordre?.totalPrice;
    
        if (montantTotal != null && totalPrice != null && montantTotal !== totalPrice) {
          group.get('montantTotal')?.setErrors({ totalPriceMismatch: true });
          return { totalPriceMismatch: true };
        }
    
        return null;
      };
    }
    
    
    }



