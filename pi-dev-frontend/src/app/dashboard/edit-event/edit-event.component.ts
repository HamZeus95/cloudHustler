import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventServiceService } from 'src/app/event-service.service';
import { Event } from 'src/app/core/modules/event';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  uuid_event: string = '';  // ID de l'événement
  event: Event = { uuid_event: '', name: '', startDate: '', location: '', description: '', banner: '', endDate: '', imgsUrls: [], participants: [] };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis la route
    this.uuid_event = this.route.snapshot.paramMap.get('id')!;
    this.getEventDetails();  // Appeler la méthode pour récupérer les détails de l'événement
  }

  // Méthode pour récupérer les détails de l'événement par ID
  getEventDetails(): void {
    this.eventService.getEventById(this.uuid_event).subscribe(
      (event) => {
        this.event = event;  // Assigner l'événement retourné à la variable 'event'
        console.log('Event details:', this.event);  // Afficher l'événement dans la console
      },
      (error) => {
        console.error('Error fetching event details:', error);  // Afficher l'erreur dans la console
      }
    );
  }

  // Validation de la date de début et de la date de fin
  validateDate(form: NgForm): boolean {
    const startDate = new Date(this.event.startDate);
    const endDate = new Date(this.event.endDate);
    const today = new Date();

    if (startDate < today) {
      form.controls['startDate'].setErrors({ 'pastDate': true });
      return false;
    }
    if (endDate < startDate) {
      form.controls['endDate'].setErrors({ 'endBeforeStart': true });
      return false;
    }
    return true;
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.validateDate(form)) {
      console.log('Event to update:', this.event);  // Vérifie les données envoyées
      this.eventService.updateEvent(this.event).subscribe(
        (updatedEvent) => {
          console.log('Event updated:', updatedEvent);
          // Rediriger vers une autre page après la mise à jour, par exemple vers le tableau de bord
          this.router.navigate(['/dashboard/billing']);
        },
        (error) => {
          console.error('Error updating event:', error);  // Afficher l'erreur dans la console
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
