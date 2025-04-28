import { Component, OnInit } from '@angular/core';
import { ServiceeService } from '../../../core/services/job/servicee.service';
import { Servicee } from 'src/app/core/models/servicee';
import { Router } from '@angular/router';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  
  services: Servicee[] = [];
  newService: Servicee = {
    title: '',
    description: '',
    isHiring: false,
    category: '',
    salary: 0,
    imageUrl: '',
    nbWorkers: 0
  };
  serviceToUpdate: Servicee | null = null;


  constructor(private servicesService: ServiceeService , private router: Router) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices() {
    this.servicesService.getAllServices().subscribe({
      next: (data:any) => {
        console.log('Données reçues :', data);
        this.services = data;
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des services', err);
      }
    });
  }
  addService(): void {
    this.servicesService.createService(this.newService).subscribe({
      next: (response:any) => {
        console.log('Service ajouté avec succès:', response);
        // Affichage d'une alerte pour informer l'utilisateur du succès
        alert('Le service a été ajouté avec succès !');
        // Réinitialiser le formulaire ou effectuer d'autres actions
        this.resetNewServiceForm(); // Exemple de réinitialisation du formulaire
      },
      error: (err:any) => {
        console.error('Erreur lors de l\'ajout du service:', err);
        alert('Une erreur est survenue lors de l\'ajout du service.');
      }
    });
  }


  deleteService(uuid_service: string) {
    if (uuid_service) {  // S'assurer que l'UUID est défini
      this.servicesService.deleteService(uuid_service).subscribe({
        next: () => {
          this.fetchServices();
        },
        error: (err:any) => {
          console.error('Erreur lors de la suppression du service', err);
        }
      });
    } else {
      console.error('UUID du service non défini');
    }
  }
  
  updateService(): void {
    if (this.serviceToUpdate && this.serviceToUpdate.uuid_service) {
      this.servicesService.updateService(this.serviceToUpdate.uuid_service, this.serviceToUpdate).subscribe({
        next: (response:any) => {
          console.log('Service mis à jour avec succès:', response);
          alert('Le service a été mis à jour avec succès !');
          this.resetNewServiceForm();
          this.serviceToUpdate = null; // Réinitialiser le service à mettre à jour
          this.fetchServices(); // Recharger la liste des services
        },
        error: (err:any) => {
          console.error('Erreur lors de la mise à jour du service:', err);
          alert('Une erreur est survenue lors de la mise à jour du service.');
        }
      });
    } else {
      console.error('UUID du service non défini');
      alert('L\'UUID du service est requis pour la mise à jour.');
    }
  }
  
  
  resetNewServiceForm() {
    this.newService = {
     
      title: '',
      description: '',
      isHiring: false,
      category: '',
      salary: 0,
      imageUrl: '',
      nbWorkers: 0
    };
  }
  // Méthode pour initialiser le formulaire de mise à jour avec les données du service
  editService(service: Servicee): void {
    this.serviceToUpdate = { ...service }; // Copier les données du service sélectionné
    this.newService = { ...service }; // Pré-remplir le formulaire avec les données
  }

// Réinitialiser le service à mettre à jour
cancelUpdate() {
  this.serviceToUpdate = null;
}
postuler(uuid: string | undefined): void {
  if (uuid) {
    this.router.navigate(['/frontoffice/job-request', uuid]);
  } else {
    console.error('UUID du service non défini');
  }
}

}
