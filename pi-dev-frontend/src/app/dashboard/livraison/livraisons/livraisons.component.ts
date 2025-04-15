import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
    statut: '',
    dateCreation: '',
    adresseLivraison: '',
    dateLivraison: ''
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
    labels: ['livree', 'En attente', 'En transit'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      hoverBackgroundColor: ['#218838', '#e0a800', '#c82333']
    }]
  };

  public pieChartType: ChartType = 'pie';

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.filteredlivraisons = [];
    this.initializeForm();
  }

  private initializeForm(): void {
    this.livraisonForm = this.fb.group({
      /*statut: '',
    dateCreation: '',
    adresseLivraison: '',
    dateLivraison: '' */
    //dateCreation: ['', Validators.required],
    dateLivraison: ['', Validators.required],
    adresseLivraison: ['', Validators.required],
    statut: ['', Validators.required]
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
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
      statut: '',
      dateCreation: '',
      adresseLivraison: '',
      dateLivraison: ''
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
    responsive: false,
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
    this.livraisonForm = this.fb.group({
      //dateCreation: ['', Validators.required],
    dateLivraison: ['', Validators.required],
    adresseLivraison: ['', Validators.required],
    statut: ['', Validators.required],
    });

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

  onSubmit(): void {
    if (this.livraisonForm.invalid) return;

    if (this.isEditMode) {
      const updatedlivraison: Livraison = {
        id: this.id,
        ...this.livraisonForm.value
      };

      this.livraisonService.update(this.id, updatedlivraison).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/livraisons']);
          this.loadlivraisons();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la livraison:', err);
        }
      });
    } else {
      this.livraisonService.create(this.livraisonForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/livraisons']);
          this.loadlivraisons();
          this.closeModal();
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout de la livraison:", err);
        }
      });
    }
  }

  onCancel(): void {
    this.livraisonForm.reset();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
}