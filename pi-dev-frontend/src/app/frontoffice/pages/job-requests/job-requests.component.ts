import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Servicee } from 'src/app/core/models/servicee';
import { ServiceRequest } from 'src/app/core/models/serviceRequests';
import { ServiceRequestsService } from 'src/app/core/services/job/service-requests.service';
import { ServiceeService } from 'src/app/core/services/job/servicee.service';
@Component({
  selector: 'app-job-requests',
  templateUrl: './job-requests.component.html',
  styleUrls: ['./job-requests.component.css']
})
export class JobRequestsComponent {
  serviceRequests: ServiceRequest[] = [];
  selectedService: Servicee | null = null; 
  cvUrl: string = ''; 
  uuid_service: string = '';
  fomrSubmitedd=false;

  constructor(
    private serviceRequestsService: ServiceRequestsService,
    private servicesService: ServiceeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('jobId');
  if (serviceId) {
    this.loadServiceById(serviceId);  
  }else{
    console.error('UUID du service manquant dans l\'URL');

  }
  }

  loadServiceById(uuid_service: string): void {
    this.servicesService.getServiceById(uuid_service).subscribe({
      next: (data:any) => {
        this.selectedService = data; // Affecter les données du service à selectedService
        console.log('Service récupéré:', data);
      },
      error: (err:any) => {
        console.error('Erreur lors de la récupération du service', err);
      }
    });
  }
  onFormSubmit(){
    this.fomrSubmitedd=true;
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
