import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  BarController,       // 👈 Import ajouté
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';  
import { ServiceRequest } from 'src/app/core/models/serviceRequests';
import { TypeStatus } from 'src/app/core/models/typeStatus';
import { FileUploadService } from 'src/app/core/services/job/file-upload.service';
import { ServiceRequestsService } from 'src/app/core/services/job/service-requests.service';
 @Component({
  selector: 'app-jobs-requests-dashboard',
  templateUrl: './jobs-requests-dashboard.component.html',
  styleUrls: ['./jobs-requests-dashboard.component.css']
})
export class JobsRequestsDashboardComponent implements OnInit{
  servicesRequests: ServiceRequest[] = [];
  isLoading: boolean = true;
  error: string = '';
  totalServiceRequests: number = 0; // Nouveau champ pour le nombre total des demandes
  statusCounts: { accepted: number, rejected: number, pending: number } = {
    accepted: 0,
    rejected: 0,
    pending: 0
  };
  public doughnutChart: any;
  resumeContent: string = '';
  isModalVisible: boolean = false;  // Pour gérer l'affichage de la modale


  constructor(
    private serviceRequestService: ServiceRequestsService,
    private router: Router,
    private fileService: FileUploadService
  ) {
    // ✅ Enregistrement complet pour les graphiques à barres
    Chart.register(
      ArcElement,
      Tooltip,
      Legend,
      DoughnutController,
      BarController,   // 👈 Enregistrement ajouté ici aussi
      BarElement,
      CategoryScale,
      LinearScale
    );
  }

  ngOnInit(): void {
    this.loadServiceRequests();
    this.loadStatusCounts();
    this.createChart();
  }

  loadServiceRequests(): void {
    this.serviceRequestService.getAllServiceRequests().subscribe({
      next: (data) => {
        this.servicesRequests = data;
        this.totalServiceRequests = data.length; // Calculer le nombre total des demandes
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes de service :', err);
        this.error = "Erreur lors du chargement des demandes.";
        this.isLoading = false;
      }
    });
  }

  isImage(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png|pdf)$/) != null;
  }

  accepterDemande(request: ServiceRequest) {
    request.status = TypeStatus.ACCEPTED;
    this.serviceRequestService.updateServiceRequest(request.uuid_serviceRequest, request).subscribe({
      next: () => {
        console.log('Demande acceptée, redirection...');
        this.router.navigate(['/backoffice/email']); // redirection après succès
        this.loadStatusCounts(); // Recharger les statistiques des statuts après modification
      },
      error: err => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

  rejeterDemande(request: ServiceRequest) {
    request.status = TypeStatus.REJECTED;
    this.updateRequestStatus(request);
  }

  updateRequestStatus(request: ServiceRequest): void {
    console.log("Avant update :", request); // 🪵 DEBUG ICI
    this.serviceRequestService.updateServiceRequest(request.uuid_serviceRequest, request).subscribe({
      next: () => {
        console.log('Statut mis à jour avec succès');
        this.loadServiceRequests(); // recharger les données après update
        this.loadStatusCounts(); // Recharger les statistiques des statuts après modification
      },
      error: err => {
        console.error('Erreur lors de la mise à jour du statut', err);
      }
    });
  }

  loadStatusCounts(): void {
    this.serviceRequestService.getStatusCounts().subscribe({
      next: (data) => {
        console.log('Réponse des stats:', data); // Vérifie si les valeurs sont correctement reçues
        this.statusCounts = {
          accepted: data.accepted || 0,
          rejected: data.rejected || 0,
          pending: data.pending || 0
        };
        console.log('Statistiques des statuts après mise à jour :', this.statusCounts);
        this.createChart(); // Créer ou mettre à jour le graphique après avoir récupéré les données
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques de statut :', err);
      }
    });
  }

  createChart(): void {
    console.log('Création du graphique avec les données suivantes :', this.statusCounts);

    // Si un graphique existe déjà, on le détruit avant de le recréer
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    // Créer un graphique en barres
    this.doughnutChart = new Chart('barChartCanvas', {
      type: 'bar',  // Type de graphique en barres
      data: {
        labels: ['Acceptées', 'Rejetées', 'En attente'],
        datasets: [{
          label: 'Statut des demandes',
          data: [this.statusCounts.accepted, this.statusCounts.rejected, this.statusCounts.pending],  // Utilisation des valeurs dynamiques
          backgroundColor: ['#1B4F08', '#FF6384', '#FFCD56'],
          borderColor: ['#1B4F08', '#9e0e40', '#FFCD56'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // permet de contrôler la taille via CSS
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#fff',
            titleColor: '#000',
            bodyColor: '#000',
            borderColor: '#ccc',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#333',
              font: {
                size: 12
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              font: {
                size: 12
              }
            },
            grid: {
              color: '#eee'
            }
          }
        }
      }
    });
  }
  resume(fileName: string): void {
    console.log("fileNamepath" + fileName);
    this.fileService.resumefile(fileName).subscribe((data) => {
      this.resumeContent = data.resume;
      this.isModalVisible = true;  // Affiche la modale après avoir chargé le contenu
    });
  }
  closeModal(): void {
    this.isModalVisible = false;  // Ferme la modale
  }
  
}
