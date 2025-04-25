import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateQuestionsComponent } from './update-questions/update-questions.component';

@Component({
  selector: 'app-quiz',
  
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @ViewChild('quizComponentRef') updateQuestionComp!: UpdateQuestionsComponent;

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
      this.realodQuiz();
      // Récupérer le quiz du service
     
    });
  }
  realodQuiz(){
    this.quizService.getQuizByServiceId(this.serviceId).subscribe(
      (data) => {
        this.thereIsAquiz=data!=null
        this.quiz=data;
        console.log(this.quiz.questions);
        setTimeout(() => {
          this.updateQuestionComp?.addQuestion(); // appeler addQuestion via ViewChild
        }, 0);
      },
      (error) => {
        console.error('Erreur lors de la récupération du quiz:', error);
      }
    );
  }
 
  
 
}
