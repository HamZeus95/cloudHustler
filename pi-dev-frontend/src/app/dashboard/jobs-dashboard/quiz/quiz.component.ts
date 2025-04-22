import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  serviceId!: string;
  quiz: any = null; // Initialisation avec null pour détecter s'il n'y a pas de quiz.
  thereIsAquiz:boolean=false; // Formulaire pour créer ou mettre à jour un quiz.

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du service passé dans l'URL
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('id') || '';
      console.log("Service ID:", this.serviceId);

      // Récupérer le quiz du service
      this.quizService.getQuizByServiceId(this.serviceId).subscribe(
        (data) => {
          this.thereIsAquiz=data!=null
          this.quiz=data;
        },
        (error) => {
          console.error('Erreur lors de la récupération du quiz:', error);
        }
      );
    });
  }
 
  
 
}
