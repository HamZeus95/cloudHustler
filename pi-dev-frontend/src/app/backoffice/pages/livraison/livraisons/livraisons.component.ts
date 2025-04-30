import { Livraison } from 'src/app/core/models/livraison/livraison';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';
import { FactureService } from 'src/app/core/services/livraison/facture.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from 'src/app/core/error-dialog/error-dialog.component';
import { CustomValidators } from 'src/app/core/validators/custom.validators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraisons.component.html',
  styleUrls: ['./livraisons.component.css']
})
export class LivraisonComponent implements OnInit {
  isModalOpen = false;
  percentages = {
    Livree: 0,
    enAttente: 0,
    enTransit: 0
  };
  livraisons: Livraison[] = [];
  filteredlivraisons: Livraison[] = [];
  displayModal: boolean = false;
  selectedlivraison: Livraison | null = null;
  currentPage = 1;
  itemsPerPage = 5;

  newlivraison: Livraison = {
    id: 0,
    statut: 'Pending', // Valeur par défaut valide
    dateCreation: '',
    adresseLivraison: '',
    dateLivraison: '',
    deliveryDriver: undefined,
    order: undefined
  };

  counts = {
    livree: 0,
    enAttente: 0,
    enTransit: 0,
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
    labels: ['Delivered', 'Pending', 'In Transit'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      hoverBackgroundColor: ['#218838', '#e0a800', '#c82333']
    }]
  };

  public pieChartType: ChartType = 'pie';

  deliveryDrivers: any[] = [];
  orders: any[] = [];

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private factureService: FactureService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient // Inject HttpClient
  ) {
    this.filteredlivraisons = [];
    this.initializeForm();
  }

  private initializeForm(): void {
    this.livraisonForm = this.fb.group({
      dateLivraison: ['', [
        Validators.required,
        this.dateValidators()
      ]],
      adresseLivraison: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      statut: ['Pending'], // Ne pas désactiver si requis
      deliveryDriver: [null, Validators.required],
      order: [null, Validators.required]
    });
  }

  
  searchTerm: string = '';

  filteredLivraisonsFn(value: string): void {
    if (!value) {
      this.filteredlivraisons = [...this.livraisons];
      return;
    }
    const searchTerm = value.toLowerCase().trim();
    this.filteredlivraisons = this.livraisons.filter(livraison => 
      this.isMatchingSearch(livraison, searchTerm)
    );
  }

  private isMatchingSearch(livraison: Livraison, searchTerm: string): boolean {
    return [
      livraison?.id?.toString(),
      livraison?.statut?.toLowerCase(),
      this.datePipe.transform(livraison?.['dateCreation'], 'dd/MM/yyyy'),
      this.datePipe.transform(livraison?.['dateLivraison'], 'dd/MM/yyyy'),
      livraison?.adresseLivraison?.toLowerCase(),

    ].some(value => value?.includes(searchTerm));
  }

  loadlivraisons() {
    this.livraisonService.getAll().subscribe(
      (data: Livraison[]) => {
        this.livraisons = data;
        this.filteredlivraisons = data;
      },
      error => {
        console.error('Erreur lors de la récupération des livraisons', error);
      }
    );
  }

  ajouterlivraison() {
    this.livraisonService.create(this.newlivraison).subscribe(
      () => {
        this.loadlivraisons();
        this.resetNewlivraison();
      },
      error => {
        console.error("Erreur lors de l'ajout de la livraison", error);
      }
    );
  }

  closeDialog(): void {
    this.displayModal = false;
  }

  supprimerlivraison(id: number): void {
    if (confirm('Are you sure you want to delete this delivery?')) {
      this.livraisonService.delete(id).subscribe({
        next: () => {
          this.loadlivraisons();
          this.loadStats();
        },
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  resetNewlivraison() {
    this.newlivraison = {
      id: 0,
      statut: 'Pending', // Valeur par défaut valide
      dateCreation: '',
      adresseLivraison: '',
      dateLivraison: '',
      deliveryDriver: undefined,
      order: undefined
    };
  }

  openDialog(livraison: Livraison) {
    this.selectedlivraison = livraison;
    this.displayModal = true;
  }

  loadStats() {
    this.livraisonService.getLivraisonsCountByStatus().subscribe({
      next: (counts) => {
        this.pieChartData.datasets[0].data = [
          counts.livree,
          counts.enAttente,
          counts.enTransit
        ];
        this.updatePercentages(counts);
      },
      error: (err) => console.error(err)
    });
  }

  updatePercentages(counts: any) {
    const total = counts.total || 1;
    this.percentages = {
      Livree: Math.round((counts.livree / total) * 100),
      enAttente: Math.round((counts.enAttente / total) * 100),
      enTransit: Math.round((counts.enTransit / total) * 100)
    };
  }

  public miniChartType: ChartType = 'doughnut';

  public miniChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    // Using the correct property for doughnut chart cutout percentage
   
    elements: {
      arc: {
        borderWidth: 0,
      }
    }
  };

  getMiniChartData(count: number): ChartConfiguration['data'] {
    const remaining = this.counts.total - count;
    return {
      labels: ['Statut', 'Reste'],
      datasets: [
        {
          data: [count, remaining > 0 ? remaining : 0],
          backgroundColor: [
            count === this.counts.livree ? '#1cc88a' : 
            count === this.counts.enAttente ? '#f6c23e' : '#4e73df',
            '#eaecf4'
          ],
          borderWidth: 0
        }
      ]
    };
  }

  livraisonForm!: FormGroup;
  isEditMode = false;
  id!: number;

  ngOnInit(): void {
    this.loadlivraisons();
    this.livraisonService.getLivraisonsCountByStatus().subscribe({
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
    this.loadDeliveryDrivers();
    this.loadOrders();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = params['id'];
        this.livraisonService.getById(this.id).subscribe(data => {
          this.livraisonForm.patchValue(data);
        });
      }
    });
  }

  private loadDeliveryDrivers() {
    this.factureService.getAllDelivery().subscribe({
      next: (drivers) => {
        this.deliveryDrivers = drivers;
        console.log('Drivers loaded:', drivers);
      },
      error: (error) => console.error('Error loading drivers:', error)
    });
  }

  private loadOrders() {
    this.factureService.getAllOrdres().subscribe({
      next: (orders) => {
        // Récupérer d'abord toutes les livraisons
        this.livraisonService.getAll().subscribe({
          next: (livraisons) => {
            // Créer un ensemble des IDs des commandes déjà affectées
            const ordresAffectes = new Set(livraisons.map(liv => liv.order?.uuid_order));
            
            // Filtrer les ordres qui ne sont pas dans l'ensemble des ordres affectés
            this.orders = orders.filter(order => !ordresAffectes.has(order.uuid_order));
            console.log('Ordres disponibles:', this.orders);
          },
          error: (error) => console.error('Erreur chargement livraisons:', error)
        });
      },
      error: (error) => console.error('Erreur chargement ordres:', error)
    });
  }

  onSubmit(): void {
    if (this.livraisonForm.invalid) {
      Object.keys(this.livraisonForm.controls).forEach(key => {
        const control = this.livraisonForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const formValue = this.livraisonForm.getRawValue(); // Gets value including disabled fields
    
    const livraison: Livraison = {
      ...formValue,
      statut: 'Pending',
      dateCreation: new Date().toISOString() // This will be overwritten by backend
    };

    // Continue with your existing save logic
    this.saveChanges(livraison);
  }

  private saveChanges(formValue: any) {
    if (this.isEditMode) {
      // ... code existant pour l'édition ...
    } else {
      this.livraisonService.create(this.livraisonForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Delivery created successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.closeModal();
          this.loadlivraisons();
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
  }

  openModal() {
    this.isModalOpen = true;
    this.livraisonForm.reset(); // Réinitialiser le formulaire
    this.isEditMode = false;
    // Initialiser avec des valeurs par défaut si nécessaire
    this.livraisonForm.patchValue({
      statut: '',
      adresseLivraison: '',
      dateLivraison: ''
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.livraisonForm.reset();
  }

  get paginatedlivraisons(): Livraison[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredlivraisons.slice(start, end);
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.filteredlivraisons.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  Math = Math;

  // Validateur pour les dates
  private dateValidators(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Vérifie si la date est dans le passé
      if (selectedDate < today) {
        return { pastDate: true };
      }
  
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

  // Validateur pour la disponibilité du livreur
  getDeliveryStatusClass(status: string): string {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'PENDING':
      case 'EN ATTENTE':
        return 'EN_ATTENTE';
      case 'DELIVERED':
      case 'LIVREE':
      case 'LIVRÉE':
        return 'LIVREE';
      case 'IN TRANSIT':
      case 'EN TRANSIT':
        return 'EN_TRANSIT';
      default:
        return '';
    }
  }
  desaffecterLivreur(idLivraison: number) {
    if (confirm('Are you sure you want to disassociate this delivery driver?')) {
      this.http.put(`/api/v1/livraisons/desaffecter/${idLivraison}`, {}).subscribe(
        response => {
          console.log('Livreur désaffecté avec succès', response);
          this.loadlivraisons(); // Reload the deliveries to update the view
        },
        error => console.error('Erreur lors de la désaffectation', error)
      );
    }
  }
}