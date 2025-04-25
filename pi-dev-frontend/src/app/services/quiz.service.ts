import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicee } from 'src/core/modules/servicee';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
private apiUrl = 'http://localhost:8090/CloudHustel/quiz';

  constructor(private http: HttpClient) {}

  // Récupérer tous les services
  getQuizByServiceId(id:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/byServiceId/${id}`);
  }

 
 
  // Get all quizzes
  getAllQuizzes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
 
  // Check if quiz exists for a service
  doesQuizExistForService(serviceId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existsByServiceId/${serviceId}`);
  }

  // Create a new quiz for a service
  createQuizForService(serviceId: string, quiz: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${serviceId}`, quiz);
  }

  // Get quiz by ID
  getQuizById(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${quizId}`);
  }

  // Add a question to a quiz
  addQuestionToQuiz(quizId: string, question: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${quizId}/questions`, question);
  }

  // Get questions for a quiz
  getQuestionsForQuiz(quizId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${quizId}/questions`);
  }

  // Delete a question by ID
  deleteQuestion(questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/questions/${questionId}`);
  }

  // Add an answer to a question
  addAnswerToQuestion(questionId: string, answer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/questions/${questionId}/answers`, answer);
  }

  // Get answers for a question
  getAnswersForQuestion(questionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/${questionId}/answers`);
  }

  // Delete an answer by ID
  deleteAnswer(answerId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/answers/${answerId}`);
  }

  // Set the correct answer for a question
  setCorrectAnswer(questionId: string, answerId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/questions/${questionId}/correctAnswer/${answerId}`, {});
  }
}
 
export interface Quiz {
  id?: string;
  title: string;
  description: string;
  questions: Array<{
    id?:string;
    questionText: string;
    answers: Array<{
      id?:string;

      answerText: string;
    }>;
    correctAnswer: {
      id?:string;
      answerText: string;
    };
  }>;
}