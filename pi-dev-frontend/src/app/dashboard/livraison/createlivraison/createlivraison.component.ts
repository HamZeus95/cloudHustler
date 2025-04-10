import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Livraison } from 'src/app/core/models/livraison/livraison';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';

@Component({
  selector: 'app-createlivraison',
  templateUrl: './createlivraison.component.html',
  styleUrls: ['./createlivraison.component.css']
})
export class CreatelivraisonComponent implements OnInit {
  livraisonForm!: FormGroup;
  isEditMode = false;
  livraisonId!: number;

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.livraisonForm = this.fb.group({
      adresseLivraison: ['', Validators.required],
      statut: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.livraisonId = params['id'];
        this.livraisonService.getById(this.livraisonId).subscribe(data => {
          this.livraisonForm.patchValue(data);
        });
      }
    });
  }

  onSubmit() {
    if (this.livraisonForm.valid) {
      const livraisonData: Livraison = this.livraisonForm.value;
  
      if (this.isEditMode) {
        this.livraisonService.update(this.livraisonId, livraisonData).subscribe(() => {
          console.log('Livraison mise à jour');
          this.router.navigate(['/livraisons']);
        });
      } else {
        this.livraisonService.create(livraisonData).subscribe(() => {
          console.log('Livraison ajoutée');
          this.router.navigate(['/livraisons']);
        });
      }
  
      console.log("Formulaire soumis");
    }
  }
  
  @Input() set selectedlivraison(value: Livraison | null) {
    if (value) {
      this.livraisonForm.patchValue({
        statut: value.statut,
        adresseLivraison: value.adresseLivraison,
        // Pas besoin de dateCreation (elle est générée auto)
        dateLivraison: value.dateLivraison
      });
  
      this.isEditMode = true;
      this.livraisonId = value.id!; // stocke l’ID pour faire un update
    }
  }
  @Input() livraison: Livraison | null = null; // Réception de la livraison (null si nouveau)
  onCancel(): void {
    this.router.navigate(['/livraisons']); // Remplace '/livraisons' par la route réelle de ta liste
  }
  
}


