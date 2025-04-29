import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servicee } from 'src/app/core/models/servicee';
import { ServiceeService } from 'src/app/core/services/job/servicee.service';

@Component({
  selector: 'app-jobs-back',
  templateUrl: './jobs-back.component.html',
  styleUrls: ['./jobs-back.component.css']
})
export class JobsBackComponent  implements OnInit{
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
    this.router.navigate(['/backoffice/jobsRequests']);
  }
  
  addQuizToService(uuid_service:any){
    console.log(uuid_service)
    this.router.navigate([`/backoffice/quiz/${uuid_service}`]);
  }
  }
  


