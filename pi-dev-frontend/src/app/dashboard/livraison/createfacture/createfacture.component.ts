import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/core/models/livraison/facture';
import { FactureService } from 'src/app/services/livraison/facture.service';


@Component({
  selector: 'app-createfacture',
  templateUrl: './createfacture.component.html',
  styleUrls: ['./createfacture.component.css']
})
export class CreatefactureComponent implements OnInit {
  factureForm!: FormGroup;
  isEditMode = false;
  id!: number;
  factures: Facture[] = [];


  constructor(
    private fb: FormBuilder,
    private factureService: FactureService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.factureForm = this.fb.group({
      dateEmission: ['', Validators.required],
      montantTotal: [0, Validators.required],
      statut: ['', Validators.required],
     /* livraison: this.fb.group({
        id: [null, Validators.required]  // Utilise un ID si tu veux lier une livraison
      })*/
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.id = params['id'];
        this.factureService.getById(this.id).subscribe(data => {
          this.factureForm.patchValue(data);
        });
      }
    });
  }
  loadFactures() {
      this.factureService.getAll().subscribe(
        (data: Facture[]) => {
          this.factures = data;
        },
        error => {
          console.error('Erreur lors de la récupération des factures', error);
        }
      );
    }

  onSubmit(): void {
    if (this.isEditMode) {
      this.factureService.update(this.id, this.factureForm.value).subscribe(() => {
        this.router.navigate(['/factures']);
        this.loadFactures(); // Redirection après modification
      });
    } else {
      this.factureService.add(this.factureForm.value).subscribe(() => {
        this.router.navigate(['/factures']); // Redirection après ajout
      });
    }
  }
  onCancel(): void {
    this.factureForm.reset();
  }
}