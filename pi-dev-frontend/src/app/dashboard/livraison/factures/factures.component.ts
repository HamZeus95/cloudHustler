import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Facture } from 'src/app/core/models/livraison/facture';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { FactureService } from 'src/app/services/livraison/facture.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';



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
    statut: '',
    livraison: {
      id: 0,
      statut: '',
      dateCreation: ''
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
    labels: ['Payées', 'En attente', 'Annulées'],
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
    private datePipe: DatePipe
  ) {
    this.filteredFactures = [];
    this.initializeForm();
  }

  private initializeForm(): void {
    this.factureForm = this.fb.group({
      dateEmission: ['', Validators.required],
      montantTotal: [0, [Validators.required, Validators.min(0)]],
      statut: ['', Validators.required],
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
        console.error('Erreur lors de la récupération des factures', error);
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
      if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
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
      livraison: { id: 0, statut: '', dateCreation: '' }
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
    this.factureForm = this.fb.group({
      dateEmission: ['', Validators.required],
      montantTotal: [0, Validators.required],
      statut: ['', Validators.required],
 
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = params['id'];
        this.factureService.getById(this.id).subscribe(data => {
          this.factureForm.patchValue(data);
        });
      }
    });


    

    }

    onSubmit(): void {
      if (this.factureForm.invalid) {
        // Empêcher la soumission si le formulaire est invalide
        return;
      }
  
      if (this.isEditMode) {
        // Création de l'objet facture avec l'id et les données du formulaire
        const updatedFacture: Facture = {
          id: this.id,
          ...this.factureForm.value
        };
    
        // Appel de la méthode update avec l'id et l'objet facture
        this.factureService.update(this.id, updatedFacture).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/factures']);
            this.loadFactures();
            this.closeModal();
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la facture:', err);
          }
        });
      } else {
        // Création d'une nouvelle facture
        this.factureService.add(this.factureForm.value).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/factures']); // Rediriger après ajout
            this.loadFactures(); // Recharger la liste des factures
            this.closeModal();  // Fermer la modale
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout de la facture:', err);
          }
        });
      }
    }
  
  onCancel(): void {
    this.factureForm.reset();
  }
  openModal() {
    this.isModalOpen = true; // Ouvre la fenêtre modale
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


  
  
}


