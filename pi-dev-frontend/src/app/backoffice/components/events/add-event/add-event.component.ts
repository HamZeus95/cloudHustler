import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventServiceService } from 'src/app/core/services/event-service.service';
import { Event } from 'src/app/core/models/event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;
  http: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.validateFutureDate]],
      endDate: ['', Validators.required],
      max: ['', Validators.required],
      location: ['', Validators.required],
      banner: [''],
      isOnline: [false],
      description: ['', Validators.required],
      onlineLink: ['']
    });

    // Mise à jour dynamique des validateurs selon le type d’événement
    this.eventForm.get('isOnline')!.valueChanges.subscribe((isOnline: boolean) => {
      this.toggleLocationValidators(isOnline);
    });

    // Pour l’état initial
    this.toggleLocationValidators(this.eventForm.get('isOnline')!.value);
  }

  toggleLocationValidators(isOnline: boolean) {
    const locationControl = this.eventForm.get('location');
    const onlineLinkControl = this.eventForm.get('onlineLink');

    if (isOnline) {
      locationControl?.clearValidators();
      locationControl?.updateValueAndValidity();

      onlineLinkControl?.setValidators([Validators.required]);
      onlineLinkControl?.updateValueAndValidity();
    } else {
      locationControl?.setValidators([Validators.required]);
      locationControl?.updateValueAndValidity();

      onlineLinkControl?.clearValidators();
      onlineLinkControl?.updateValueAndValidity();
    }
  }

  validateFutureDate(control: AbstractControl) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    today.setHours(0, 0, 0, 0); // ignore heure
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  todayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent: Event = {
        name: this.eventForm.value.name,
        startDate: this.eventForm.value.date,
        endDate: this.eventForm.value.endDate,
        location: this.eventForm.value.location || '',
        uuid_event: '',
        description: this.eventForm.value.description || '',
        banner: this.eventForm.value.banner || '',
        maxParticipants: this.eventForm.value.max || '',
        imgsUrls: [],
        participants: [],
        isOnline: this.eventForm.value.isOnline,
        onlineLink: this.eventForm.value.onlineLink || ''
      };

      this.eventService.addEvent(newEvent).subscribe(
        (event) => {
          console.log('Événement ajouté:', event);
          alert ("Event Added succefully");
          this.router.navigate(['/backoffice/backEvent']);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'événement:', error);
        }
      );
    }
  }

  generateDescription() {
    this.isLoading = true; // Affiche le spinner

    const { name, location, date } = this.eventForm.value;

    if (name && location && date) {
      this.eventService.generateDescription(name, location, date).subscribe(
        (response: any) => {
          // Injecte la description générée dans le champ de texte
          this.eventForm.patchValue({ description: response });

          // Arrêter le chargement
          this.isLoading = false;
        },
        (error) => {
          console.error("Erreur lors de la génération de la description :", error);

          // Arrêter le chargement même en cas d'erreur
          this.isLoading = false;
        }
      );
    } else {
      // Si les champs nécessaires ne sont pas remplis, on arrête le chargement
      this.isLoading = false;
    }
  }

  // Nouvelle méthode pour générer un événement aléatoire
  generateRandomEvent() {
    const randomEvent = {
      name: `Event ${Math.floor(Math.random() * 1000)}`,
      date: this.todayDate(),
      endDate: this.todayDate(),
      location: `Location ${Math.floor(Math.random() * 100)}`,
      max: Math.floor(Math.random() * 100) + 1,
      description: `Random description for Event ${Math.floor(Math.random() * 1000)}`,
      banner: 'https://example.com/banner.jpg',
      
    };

    // Remplir le formulaire avec les valeurs aléatoires
    this.eventForm.patchValue(randomEvent);
  }
}
