import { Component, OnInit } from '@angular/core';
import { ServiceRequestsService } from '../services/service-requests.service';
import { ServiceeService } from '../services/servicee.service';
import { ServiceRequest } from 'src/core/modules/serviceRequests';
import { Servicee } from 'src/core/modules/servicee';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-requests',
  templateUrl: './service-requests.component.html',
  styleUrls: ['./service-requests.component.css']
})
export class ServiceRequestsComponent implements OnInit {
  serviceRequests: ServiceRequest[] = [];
  selectedService: Servicee | null = null; 
  cvUrl: string = ''; 
  uuid_service: string = '';

  constructor(
    private serviceRequestsService: ServiceRequestsService,
    private servicesService: ServiceeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('uuid'); // Utilisez 'uuid' et non 'uuid_service'
  if (serviceId) {
    this.loadServiceById(serviceId);  
    console.error('UUID du service manquant dans l\'URL');
  }
  }

  loadServiceById(uuid_service: string): void {
    this.servicesService.getServiceById(uuid_service).subscribe({
      next: (data) => {
        this.selectedService = data; // Affecter les données du service à selectedService
        console.log('Service récupéré:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du service', err);
      }
    });
  }



  // Soumettre la demande de service
 /* onSubmit(): void {
    if (this.selectedService && this.coverLetter && this.cvUrl) {
      const serviceRequest = {
        uuid_service: this.selectedService.uuid_service,
        coverLetter: this.coverLetter,
        cvUrl: this.cvUrl
      };
  
      this.serviceRequestsService.submitServiceRequest(serviceRequest).subscribe({
        next: (response) => {
          console.log('Demande soumise avec succès', response);
        },
        error: (err) => {
          console.error('Erreur lors de la soumission de la demande', err);
        }
      });
    } else {
      console.error('Tous les champs doivent être remplis');
    }
  }*/
  
  
  
}
