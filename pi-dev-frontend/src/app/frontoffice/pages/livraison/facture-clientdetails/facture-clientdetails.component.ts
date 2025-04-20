import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from 'src/app/core/services/livraison/facture.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture-clientdetails',
  templateUrl: './facture-clientdetails.component.html',
  styleUrls: ['./facture-clientdetails.component.css']
})
export class FactureClientdetailsComponent implements OnInit {
  factureDetails: any;
  
    constructor(
      private route: ActivatedRoute,
      private factureService: FactureService,
      private http: HttpClient,
      private snackBar: MatSnackBar

    ) {}
  
    ngOnInit(): void {
      const factureId = this.route.snapshot.paramMap.get('id');
      if (factureId) {
        this.factureService.getById(Number(factureId)).subscribe({
          next: (data) => {
            console.log('Received data:', data); // Debug log
            if (data && data.livraison && data.livraison.order) {
              this.factureDetails = data;
            } else {
              console.error('Incomplete data structure:', data);
            }
          },
          error: (err) => console.error('Erreur lors de la récupération des détails de la facture:', err)
        });
      }
    }
    generatePDF(): void {
      const pdfContent = document.getElementById('pdf-content');
      if (!pdfContent) return;
    
      html2canvas(pdfContent, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Facture_${this.factureDetails.id}.pdf`);
      });
    }
    

}
