import { Component, OnInit } from '@angular/core';
import { ServiceRequestsService } from 'src/app/services/service-requests.service';
import { ServiceRequest } from 'src/core/modules/serviceRequests';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-jobs-requests-dashboard',
  templateUrl: './jobs-requests-dashboard.component.html',
  styleUrls: ['./jobs-requests-dashboard.component.css']
})
export class JobsRequestsDashboardComponent implements OnInit{
  servicesRequests: ServiceRequest[] = [];
  isLoading: boolean = true;
  error: string = '';
  constructor(private serviceRequestService:ServiceRequestsService ) { }
  ngOnInit(): void {

    this.loadServiceRequests();
  }

  loadServiceRequests(): void {
    this.serviceRequestService.getAllServiceRequests().subscribe({
      next: (data) => {
        this.servicesRequests = data;
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
 
}}
