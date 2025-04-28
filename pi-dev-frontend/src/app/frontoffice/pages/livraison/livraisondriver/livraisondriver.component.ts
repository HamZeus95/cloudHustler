import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, TokenStorageService } from 'src/app/auth/service';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';

@Component({
  selector: 'app-livraisondriver',
  templateUrl: './livraisondriver.component.html',
  styleUrls: ['./livraisondriver.component.css']
})
export class LivraisondriverComponent {

displayModal: boolean = false;
  readonly userUuid = '428067bc-f4ce-4b6c-913e-d8a0a7e6eb9e'; // Replace with actual UUID retrieval

  isAuthenticated = false;
  currentUser: any = null;
    closeDialog(): void {
      this.displayModal = false;
    }
    navigateToMap(livraisonId: number) {
      this.router.navigate(['/frontoffice/suivrelivraison', livraisonId]);
    }

    selectedLivraison: Livraison | null = null; // <-- à ajouter
  
    @Output() livraisonSelected = new EventEmitter<Livraison>();
  
    livraisons: Livraison[] = [];
  
    constructor(
      private livraisonService: LivraisonService,
      private router: Router,
      private authService: AuthService,
      private tokenStorageService: TokenStorageService,
      private http: HttpClient // Inject HttpClient

    ) {
      this.loadLivraisons();
    }
    ngOnInit(): void {
      this.authService.isAuthenticated().subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.currentUser = this.tokenStorageService.getCurrentUser();
        }
        
      });
       // Subscribe to user changes
       this.tokenStorageService.getUser().subscribe(user => {
        this.currentUser = user;
      });
      console.log("yooooo",this.currentUser);
      this.loadLivraisons();
          }
  
  

    loadLivraisons() {
      //const userUuid = this.currentUser.userUUID;  
      //readonly userUuid = '428067bc-f4ce-4b6c-913e-d8a0a7e6eb9e'; // Replace with actual UUID retrieval

      // Assuming you store the UUID somewhere
      if (this.userUuid) {
        this.http.get<Livraison[]>(`/api/v1/livraisons/livreur/${this.userUuid}/ordered`).subscribe(
          (data: Livraison[]) => {
            this.livraisons = data;
          },
          (error) => {
            console.error('Error loading reordered deliveries:', error);
          }
        );
      } else {
        console.warn('User UUID not found.');
      }
    }
  
   
  
    getStatutClass(statut: string): string {
      switch (statut) {
        case 'EN ATTENTE':
          return 'status-preparation';
        case 'PAYÉ':
          return 'status-expediee';
        case 'LIVRÉ':
          return 'status-livree';
        default:
          return '';
      }
    }
    
  
  
  

  
  navigateToSuivre(id: number) {
    this.router.navigate(['/frontoffice/suivrelivraison', id]);
  }
}




