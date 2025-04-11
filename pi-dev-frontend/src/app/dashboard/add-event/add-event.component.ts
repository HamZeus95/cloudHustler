import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventServiceService } from 'src/app/event-service.service';
import { Event } from 'src/app/core/modules/event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup ;

  constructor(
    private fb: FormBuilder, // Injecter FormBuilder
    private eventService: EventServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.validateFutureDate]],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      banner: ['']
    });
  }

  // Validation personnalisée pour vérifier si la date est dans le futur
  validateFutureDate(control: AbstractControl) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    
    if (selectedDate < today) {
      return { 'pastDate': true };
    }
    return null;
  }

  // Méthode pour obtenir la date actuelle pour l'attribut min dans l'input de date
  todayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  // Soumettre le formulaire
  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent: Event = {
        name: this.eventForm.value.name,
        startDate: this.eventForm.value.date,
        location: this.eventForm.value.location,
        uuid_event: '',
        description: this.eventForm.value.description || '',
        banner: this.eventForm.value.banner || '',
        endDate: this.eventForm.value.endDate || '',
        imgsUrls: [],
        participants: []
      };

      // Appel au service pour ajouter l'événement
      this.eventService.addEvent(newEvent).subscribe(
        (event) => {
          console.log('Événement ajouté:', event);
          this.router.navigate(['/dashboard/billing']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'événement:', error);
        }
      );
    }
  }
}
