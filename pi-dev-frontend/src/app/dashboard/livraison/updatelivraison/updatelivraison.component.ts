import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Livraison } from 'src/app/models/livraison';
import { LivraisonService } from 'src/app/services/livraison.service';

@Component({
  selector: 'app-updatelivraison',
  templateUrl: './updatelivraison.component.html',
  styleUrls: ['./updatelivraison.component.css']
})
export class UpdatelivraisonComponent {
  @Input() livraison: Livraison | null = null;
  @Output() close = new EventEmitter<void>();
  livraisonForm: FormGroup;

  constructor(private livraisonService: LivraisonService, private fb: FormBuilder) {
    this.livraisonForm = this.fb.group({
      statut: ['', Validators.required],
      adresseLivraison: ['', Validators.required],
      dateLivraison: ['', Validators.required] // pas besoin de dateCreation, elle est générée automatiquement
    });
  }
  
  ngOnInit() {
    if (this.livraison) {
      this.livraisonForm.patchValue(this.livraison);
    }
  }
  
  onSubmit() {
    if (this.livraisonForm.valid) {
      // Obtenir la valeur du formulaire
      const updatedData = this.livraisonForm.value;
  
      // Assurez-vous que l'ID de la livraison existante est bien transmis pour l'update
      if (this.livraison?.id) {
        updatedData.id = this.livraison.id; // Ajoute l'ID existant à la mise à jour
  
        // Conversion de la date de livraison au format LocalDateTime (ajout de l'heure)
        updatedData.dateLivraison = this.formatDateToLocalDateTime(updatedData.dateLivraison);
  
        // Appeler le service pour mettre à jour la livraison
        this.livraisonService.update(this.livraison.id, updatedData).subscribe(() => {
          console.log('Livraison mise à jour');
          this.close.emit(); // Ferme la modale après la mise à jour
        });
      } else {
        console.error('ID de la livraison manquant pour la mise à jour.');
      }
    }
  }
  
  
  formatDateToLocalDateTime(date: string): string {
    // Convertit la date en format LocalDateTime (yyyy-MM-ddTHH:mm:ss)
    return `${date}T00:00:00`; // Tu peux ajuster l'heure si nécessaire, ici on fixe à 00:00:00
  }
  
  
  onCancel() {
    this.close.emit(); // ferme la modale sans rien faire
  }
  


}
