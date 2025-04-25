import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent {
  @Input()serviceId!:string;
  quizForm: FormGroup;
  constructor(private fb: FormBuilder,private quizService:QuizService) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.quizForm.valid) {
      console.log('Quiz Data:', this.quizForm.value);
      this.quizService.createQuizForService(this.serviceId, this.quizForm.value).subscribe(
        (response) => {
          console.log('Quiz créé avec succès:', response);
           // Redirection ou message de succès ici
        },
        (error) => {
          console.error('Erreur lors de la création du quiz:', error);
        }
      );
    }
  }
}
