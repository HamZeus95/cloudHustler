import { Component } from '@angular/core';
import { IaDashService } from 'src/app/core/services/farm-managment/ia-dash.service';

@Component({
  selector: 'app-ia-farm-dash',
  templateUrl: './ia-farm-dash.component.html',
  styleUrls: ['./ia-farm-dash.component.css']
})
export class IaFarmDashComponent {
  cropInput: string = '';
  recommendedCrop: string | null = null;

  userQuestion: string = '';
  messages: string[] = [];

  farmingTip: string = 'Remember to rotate crops every season to maintain soil health!';

  constructor(private iaDashService: IaDashService) { }

  onRecommendCrop() {
    if (!this.cropInput.trim()) return;

    const inputData = { "inputs": this.cropInput };

    this.iaDashService.recommendCrop(inputData).subscribe(response => {
      console.log(response);
      this.recommendedCrop = response[0]?.label || "No recommendation found.";
    }, error => {
      console.error(error);
      this.recommendedCrop = "Error while fetching recommendation.";
    });
  }

  onAskQuestion() {
    if (!this.userQuestion.trim()) return;

    this.messages.push("You: " + this.userQuestion);

    this.iaDashService.askFarmingQuestion(this.userQuestion).subscribe(response => {
      const answer = response.candidates[0]?.content.parts[0]?.text || "No answer found.";
      this.messages.push("Gemini: " + answer);
    }, error => {
      console.error(error);
      this.messages.push("Error communicating with Gemini.");
    });

    this.userQuestion = '';
  }

}
