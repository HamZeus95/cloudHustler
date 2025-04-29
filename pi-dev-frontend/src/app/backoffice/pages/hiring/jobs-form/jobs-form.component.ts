import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Servicee } from 'src/app/core/models/servicee';
import { FileUploadService } from 'src/app/core/services/job/file-upload.service';
import { ServiceeService } from 'src/app/core/services/job/servicee.service';

@Component({
  selector: 'app-jobs-form',
  templateUrl: './jobs-form.component.html',
  styleUrls: ['./jobs-form.component.css']
})
export class JobsFormComponent implements OnInit {
   newService: Servicee = {
       title: '',
       description: '',
       isHiring: false,
       category: '',
       salary: 0,
       imageUrl: '',
       nbWorkers: 0
     };
     @Output() formSubmitedd=new EventEmitter()
     @Input() serviceToEdit!:Servicee|null;
  
    constructor(private fileUploadService:FileUploadService,private servicesService: ServiceeService) { }
     ngOnInit(): void {
         if(this.serviceToEdit!=null){
          this.newService=this.serviceToEdit;
  
         }
     }
    onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        this.fileUploadService.uploadFile(file,"jobImage").subscribe({
          next: (data) => {
            console.log(data);
            console.log(data.filename)
            this.newService.imageUrl = data.filename;  // Le nom du fichier retourné
           },
          error: (err) => {
            console.error("Erreur lors de l'upload du fichier:", err);
          }
        });
  
      }
    }
    addService(): void {
      this.servicesService.createService(this.newService).subscribe({
        next: (response) => {
          console.log('Service ajouté avec succès:', response);
          // Affichage d'une alerte pour informer l'utilisateur du succès
          alert('Le service a été ajouté avec succès !');
          // Réinitialiser le formulaire ou effectuer d'autres actions
          this.resetNewServiceForm();
          this.formSubmitedd.emit() // Exemple de réinitialisation du formulaire
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du service:', err);
          alert('Une erreur est survenue lors de l\'ajout du service.');
        }
      });
    }
    handleSubmit(){
      if(this.serviceToEdit!=null){
        this.updateService();
      }else{
        this.addService();
      }
    }
      
    resetNewServiceForm() {
      this.newService = {
       
        title: '',
        description: '',
        isHiring: false,
        category: '',
        salary: 0,
        imageUrl: '',
        nbWorkers: 0
      };
    }
    // Méthode pour initialiser le formulaire de mise à jour avec les données du service
    editService(service: Servicee): void {
     /* this.serviceToUpdate = { ...service }; // Copier les données du service sélectionné
      this.newService = { ...service }; // Pré-remplir le formulaire avec les données
    */
   }
     
   updateService(): void {
    if (this.serviceToEdit && this.serviceToEdit.uuid_service) {
      this.servicesService.updateService(this.serviceToEdit.uuid_service, this.newService).subscribe({
        next: () => {
          console.log('Service modifié avec succès:');
          // Affichage d'une alerte pour informer l'utilisateur du succès
          alert('Le service a été modifé avec succès !');
          // Réinitialiser le formulaire ou effectuer d'autres actions
           this.formSubmitedd.emit() // Exemple de réinitialisation du formulaire
        
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du service:', err);
          alert('Une erreur est survenue lors de la mise à jour du service.');
        }
      });
    } else {
      console.error('UUID du service non défini');
      alert('L\'UUID du service est requis pour la mise à jour.');
    }
  }
  onFileSelectedd(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.newService.imageUrl = URL.createObjectURL(file);
    }}

}
