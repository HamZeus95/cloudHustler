import { Component, OnInit } from '@angular/core';
import { ServiceeService } from 'src/app/services/servicee.service';
import { Servicee } from 'src/core/modules/servicee';
import { Router } from '@angular/router';
@Component({
  selector: 'app-jobs-dashboard',
  templateUrl: './jobs-dashboard.component.html',
  styleUrls: ['./jobs-dashboard.component.css']
})
export class JobsDashboardComponent implements OnInit {
  services: Servicee[] = [];
 
  serviceToUpdate: Servicee | null = null;
  serviceFormIsOpen:boolean=false;


  constructor(private servicesService: ServiceeService , private router: Router) {}

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



  deleteService(uuid_service: string) {
    if (uuid_service) {  // S'assurer que l'UUID est défini
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


 
switchOpenForm(){
  this.serviceFormIsOpen=!this.serviceFormIsOpen;
}
getFormSubmNotif(){
  this.switchOpenForm();
  this.fetchServices();
  this.serviceToUpdate=null;
}
changeServiceToUpdate(service:any){
  this.serviceToUpdate=service;
  this.switchOpenForm();

}

goToJobsRequest() {
  this.router.navigate(['/jobsRequests']);
}

addQuizToService(uuid_service:any){
  console.log(uuid_service)
  this.router.navigate([`/dashboard/quiz/${uuid_service}`]);
}
}
