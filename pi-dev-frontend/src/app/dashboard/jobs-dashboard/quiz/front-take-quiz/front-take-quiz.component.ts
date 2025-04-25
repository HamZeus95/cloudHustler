import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/core/services/job/quiz.service';
import { ServiceRequestsService } from 'src/app/core/services/job/service-requests.service';

@Component({
  selector: 'app-front-take-quiz',
  templateUrl: './front-take-quiz.component.html',
  styleUrls: ['./front-take-quiz.component.css']
})
export class FrontTakeQuizComponent {
  quiz: any;
  quizForm: any[] = [];
  submitted = false;
  score: number = 0;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private serviceReqeuest:ServiceRequestsService
  ) {}

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.quizService.getQuizByServiceId(serviceId).subscribe(data => {
        this.quiz = data;
        this.quizForm = new Array(this.quiz.questions.length).fill(undefined); // Initialize quizForm with undefined
      });
    }
  }

  onSubmit() {
    console.log(this.quizForm);
    
    if (this.quizForm.includes(undefined)) {
      alert("Please answer all the questions.");
      return;
    }

    this.submitted = true;
    let correct = 0;

    this.quiz.questions.forEach((question: any, index: number) => {
      const selectedAnswerIndex = this.quizForm[index];
      console.log(question)
      if (question.correctAnswer.id===question.answers[selectedAnswerIndex].id) {
        correct++;
      }
    });

    this.score = correct;
    const id = this.route.snapshot.queryParamMap.get('uuid_serviceRequest')||"";

    this.serviceReqeuest.updateScoreServiceReqesut(id,this.score).subscribe((data)=>console.log(data))
  }
}
