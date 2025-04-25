import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/core/models/livraison/facture';
import { DeliveryDriver, Livraison } from 'src/app/core/models/livraison/livraison';
import { Order } from 'src/app/core/models/market/order.model';
import { FactureService } from 'src/app/core/services/livraison/facture.service';
import { LivraisonService } from 'src/app/core/services/livraison/livraison.service';


@Component({
  selector: 'app-details-livraison',
  templateUrl: './details-livraison.component.html',
  styleUrls: ['./details-livraison.component.css']
})
export class DetailsLivraisonComponent {

  @Input() livraison: Livraison | undefined;
  @Output() livraisonUpdated = new EventEmitter<Livraison>();
  
  isGeneratingPdf = false;
  isEditing = false;
  editForm!: FormGroup;
  isSaving = false;
  deliveryDrivers: DeliveryDriver[] = [];
  orders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private livraisonService: LivraisonService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private factureService: FactureService,
    
  ) {}

  ngOnInit(): void {
    if (!this.livraison) {
      this.livraison = {
        id: 0,
        dateCreation: new Date().toISOString(),
        dateLivraison: new Date().toISOString(),
        adresseLivraison: '',
        statut: 'Pending', // Replace 'Pending' with a valid LivraisonStatus value
       // dateEmission: new Date().toISOString(),
       // montantTotal: 0,
       // totalPrice: 0
      };
    }

    const livraisonId = parseInt(this.route.snapshot.paramMap.get('id') || '0'); 
    if (livraisonId) {
      this.livraisonService.getById(livraisonId).subscribe({
        next: (livraison) => {
          this.livraison = livraison;
          this.initForm(); // Initialize form after getting data
        },
        error: (error) => {
          console.error('Error while loading:', error);
          this.snackBar.open('Error loading delivery', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.initForm(); // Initialize form with default data
    }

    this.loadDeliveryDrivers();
    this.loadOrders();
  }

  private loadDeliveryDrivers() {
    this.factureService.getAllDelivery().subscribe({
      next: (drivers) => {
        this.deliveryDrivers = drivers;
        console.log('Drivers loaded:', drivers);
      },
      error: (error) => console.error('Error loading drivers:', error)
    });
  }

  private loadOrders() {
    this.factureService.getAllOrdres().subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders loaded:', orders);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  private initForm(): void {
    if (!this.livraison) return;
    
    this.editForm = this.fb.group({
      dateLivraison: [this.livraison.dateLivraison, [
        Validators.required,
        this.dateValidators()
      ]],
      adresseLivraison: [this.livraison.adresseLivraison, [
        Validators.required,
        Validators.minLength(5)
      ]],
      statut: [this.livraison.statut, Validators.required],
      deliveryDriver: [this.livraison.deliveryDriver?.address || null, Validators.required]
    });
  }
  
  private dateValidators(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Vérifie si la date est dans le passé
      if (selectedDate < today) {
        return { pastDate: true };
      }
  
      // Vérifie si la date dépasse 5 jours dans le futur
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 5);
      maxDate.setHours(23, 59, 59, 999);
  
      if (selectedDate > maxDate) {
        return { maxFutureDays: true };
      }
  
      return null;
    };
  }
  
  editLivraison(): void {
    if (!this.livraison) return;
    
    this.editForm = this.fb.group({
      dateLivraison: [this.livraison.dateLivraison, [
        Validators.required,
        this.dateValidators()
      ]],
      adresseLivraison: [this.livraison.adresseLivraison, [
        Validators.required,
        Validators.minLength(5)
      ]],
      statut: [this.livraison.statut, Validators.required],
      deliveryDriver: [this.livraison.deliveryDriver?.address || null, Validators.required]
    });
    
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.livraison || !this.editForm || this.editForm.invalid) {
      this.snackBar.open('Please correct the form errors', 'Close', { duration: 3000 });
      return;
    }
  
    this.isSaving = true;
    const formValue = this.editForm.value;
    
    const selectedDriver = this.deliveryDrivers.find(d => d.address === formValue.deliveryDriver);
  
    const updatedLivraison = {
      ...this.livraison,
      dateLivraison: formValue.dateLivraison,
      adresseLivraison: formValue.adresseLivraison,
      statut: formValue.statut, // Will be one of: 'PENDING', 'IN_TRANSIT', 'DELIVERED'
      deliveryDriver: selectedDriver
    };
  
    this.livraisonService.update(updatedLivraison.id, updatedLivraison).subscribe({
      next: (result) => {
        this.livraison = result;
        this.isEditing = false;
        this.isSaving = false;
        this.snackBar.open('Delivery updated successfully', 'OK', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error while updating:', error);
        this.isSaving = false;
        this.snackBar.open('Error while updating', 'Close', { duration: 3000 });
      }
    });
  }
  isNavbarVisible = false;
  hideTimeout: any;

  showNavbar() {
    clearTimeout(this.hideTimeout);
    this.isNavbarVisible = true;
  }

  hideNavbar() {
    // Délai avant de cacher pour éviter les disparitions soudaines
    this.hideTimeout = setTimeout(() => {
      this.isNavbarVisible = false;
    }, 300); // 300ms de délai
  }
  cancelEdit(): void {
    this.isEditing = false;
    this.editForm.reset();
  }
}


