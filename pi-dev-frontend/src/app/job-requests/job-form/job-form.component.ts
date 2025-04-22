import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ServiceRequestsService } from 'src/app/services/service-requests.service';
interface ServiceRequest {
  uploadCv: string;
  lettreMotivation: string;
}

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent {
  request: ServiceRequest = {
    uploadCv: '',
    lettreMotivation: ''
  };
  @Output() formSubmitedd = new EventEmitter<any>();  // On peut spécifier un type si nécessaire
  @Input() jobId!:string;
  constructor(private fileUploadService:FileUploadService,private serviceRqService:ServiceRequestsService, ){

  }
  onSubmit(){
    this.serviceRqService.submitServiceRequest({...this.request,serviceId:this.jobId}).subscribe(()=>{
      this.formSubmitedd.emit();
    })
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileUploadService.uploadFile(file,"cvs").subscribe({
        next: (data) => {
          console.log(data);
          console.log(data.filename)
           this.request.uploadCv = data.filename;  // Le nom du fichier retourné
         },
        error: (err) => {
          console.error("Erreur lors de l'upload du fichier:", err);
        }
      });

    }
  }

}

