import { Component, Input, OnInit } from '@angular/core';
import { QuizService, Quiz,  } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-update-questions',
  templateUrl: './update-questions.component.html',
  styleUrls: ['./update-questions.component.css']
})
export class UpdateQuestionsComponent implements OnInit {
  @Input() quiz!: Quiz;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    console.log(this.quiz);
    if(this.quiz.questions.length===0){
  this.addQuestion();
      
    }
  }

  addQuestion() {
    const newQuestion = {
      id: "0", // temporaire, mis à jour par le backend
      questionText: '',
      answers: [],
      correctAnswer: { answerText: '' }
    };
    this.quiz.questions.push(newQuestion);
  }

  deleteQuestion(index: number) {
    const question = this.quiz.questions[index];
    if (question.id) {
      this.quizService.deleteQuestion(question.id).subscribe(() => {
        this.quiz.questions.splice(index, 1);
      });
    } else {
      this.quiz.questions.splice(index, 1);
    }
  }

  saveQuestion(index: number) {
    const question = this.quiz.questions[index];
    if (!question.questionText.trim()) return;

    if (question.id!=='0') {
      // Update
      /*this.quizService.updateQuestion(question.id, question).subscribe(updated => {
        this.quiz.questions[index] = updated;
      });*/
    } else {
      console.log("im here")
      // Create
       this.quizService.addQuestionToQuiz(this.quiz.id!, {questionText:question.questionText,answers:question.answers.map((e)=>e.answerText),correctAnswer:question.correctAnswer.answerText}).subscribe(created => {
          //this.quiz.questions[index] = created;
          console.log("Question added")
      });
    }
  }

  addAnswer(questionIndex: number) {
    this.quiz.questions[questionIndex].answers.push({ answerText: '' });
  }

  deleteAnswer(questionIndex: number, answerIndex: number) {
    const answer = this.quiz.questions[questionIndex].answers[answerIndex];
    console.log(answer)
    if (answer.id!) {
      this.quizService.deleteAnswer(answer.id).subscribe(() => {
        this.quiz.questions[questionIndex].answers.splice(answerIndex, 1);
      });
    } else {
      this.quiz.questions[questionIndex].answers.splice(answerIndex, 1);
    }
  }

  saveAnswer(questionIndex: number, answerIndex: number) {
    const question = this.quiz.questions[questionIndex];
    const answer = question.answers[answerIndex];
    if (!answer.answerText.trim()) return;

    
  }

  updateCorrectAnswer(questionIndex: number, newAnswer: string) {
    this.quiz.questions[questionIndex].correctAnswer.answerText = newAnswer;
  }
}
