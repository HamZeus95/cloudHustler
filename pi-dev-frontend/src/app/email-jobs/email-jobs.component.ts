import { Component } from '@angular/core';
import { EmailJobsServiceService } from '../services/email-jobs-service.service';

@Component({
  selector: 'app-email-jobs',
  templateUrl: './email-jobs.component.html',
  styleUrls: ['./email-jobs.component.css']
})
export class EmailJobsComponent {
  to: string = '';
  subject: string = '';
  text: string = '';

  constructor(private emailService: EmailJobsServiceService) {}

  onSubmit() {
    this.emailService.sendEmail(this.to, this.subject, this.text)
      .subscribe(response => {
        alert('Email envoyé!');
      }, error => {
        alert('Erreur lors de l\'envoi de l\'email');
      });
  }

}
