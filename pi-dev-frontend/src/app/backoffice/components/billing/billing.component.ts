import { Component } from '@angular/core';
import { Servicee } from 'src/app/core/models/servicee';
import { ServiceeService } from 'src/app/services/servicee.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
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

  constructor(private servicesService: ServiceeService, private router: Router) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices() {
    this.servicesService.getAllServices().subscribe({
      next: (data) => {
        console.log('Données reçues :', data);
        this.services = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des services', err);
      }
    });

}
addService(): void {
  this.servicesService.createService(this.newService).subscribe({
    next: (response) => {
      console.log('Service ajouté avec succès:', response);
      alert('Le service a été ajouté avec succès !');
      this.resetNewServiceForm();
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout du service:', err);
      alert('Une erreur est survenue lors de l\'ajout du service.');
    }
  });
}

deleteService(uuid_service: string) {
  if (uuid_service) {
    this.servicesService.deleteService(uuid_service).subscribe({
      next: () => {
        this.fetchServices();
      },
      error: (err) => {
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
      next: (response) => {
        console.log('Service mis à jour avec succès:', response);
        alert('Le service a été mis à jour avec succès !');
        this.resetNewServiceForm();
        this.serviceToUpdate = null;
        this.fetchServices();
      },
      error: (err) => {
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

editService(service: Servicee): void {
  this.serviceToUpdate = { ...service };
  this.newService = { ...service };
}

cancelUpdate() {
  this.serviceToUpdate = null;
}

postuler(uuid: string | undefined): void {
  if (uuid) {
    this.router.navigate(['/service-request', uuid]);
  } else {
    console.error('UUID du service non défini');
  }
}
}