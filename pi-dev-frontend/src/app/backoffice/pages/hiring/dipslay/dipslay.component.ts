import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/core/services/job/file-upload.service';
 
@Component({
  selector: 'app-dipslay',
  templateUrl: './dipslay.component.html',
  styleUrls: ['./dipslay.component.css']
})
export class DipslayComponent {
  cvUrl: string | null = null;  // L'URL de l'image ou du fichier à afficher

  constructor(
    private route: ActivatedRoute,
    private fileService: FileUploadService // Injection du service
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const fileName = params['cvurl'];  // Récupère le nom du fichier depuis l'URL
      console.log('Nom du fichier:', fileName);  // Affiche le nom du fichier dans la console
      this.getFile(fileName);  // Appelle la méthode pour récupérer le fichier
    });
  }

  // Fonction pour récupérer le fichier depuis le serveur
  getFile(fileName: string): void {
    this.fileService.getFile("cvs/"+fileName).subscribe(
      (data: any) => {
        // Convertir le blob en URL
        this.cvUrl = URL.createObjectURL(data);
        console.log('URL du CV:', this.cvUrl);  // Affiche l'URL dans la console
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier:', error);
      }
    );
  }

  // Fonction pour vérifier si l'URL est une image
  isImage(url: string): boolean {
    return /\.(jpeg|jpg|gif|png|)$/i.test(url);
  }

  // Fonction pour vérifier si l'URL est un PDF
  isPdf(url: string): boolean {
    return url.endsWith('.pdf');
  }
}
