import { Component, OnInit } from '@angular/core';
import { IaDashService } from 'src/app/core/services/farm-managment/ia-dash.service';

@Component({
  selector: 'app-ia-farm-dash',
  templateUrl: './ia-farm-dash.component.html',
  styleUrls: ['./ia-farm-dash.component.css']
})
export class IaFarmDashComponent implements OnInit {
  farmData: any = null;
  selectedField: any = null;
  chatbotPrompt: string = '';
  chatbotResponse: string = '';
  loadingChatResponse: boolean = false;
  messages: any[] = [];
  cropInput: string = '';
  recommendedCrop: string | null = null;
  farmingTip: string | null = null;
  yieldPredictionData = {
    cropType: '',
    fieldSize: 0,
    plantingDate: '',
    soilType: '',
    recentWeather: ''
  };
   farmData2 = {
    fields: [
      {
        id: 1,
        name: 'Field 1',
        dimensions: { width: 50, length: 80 },
        position: { x: -30, z: -40 }
      },
      {
        id: 2,
        name: 'Field 2',
        dimensions: { width: 60, length: 90 },
        position: { x: 20, z: 30 }
      },
      {
        id: 3,
        name: 'Field 3',
        dimensions: { width: 70, length: 100 },
        position: { x: -50, z: 50 }
      },
      {
        id: 4,
        name: 'Field 4',
        dimensions: { width: 80, length: 60 },
        position: { x: 40, z: -20 }
      }
    ]
  };


  constructor(private iaDashService: IaDashService) {}

  ngOnInit(): void {
    this.fetchFarmData();
  }

  fetchFarmData(): void {
    this.iaDashService.get3DFarmData(1).subscribe(
      data => {
        this.farmData = data;
      },
      error => {
        console.error('Error fetching farm data:', error);
      }
    );
  }

  sendChatMessage(): void {
    if (!this.chatbotPrompt.trim()) return;

    this.messages.push({
      sender: 'user',
      content: this.chatbotPrompt
    });

    this.loadingChatResponse = true;

    const fieldQuery = this.isFieldQuery(this.chatbotPrompt);

    if (fieldQuery) {
      const enhancedPrompt = `${this.chatbotPrompt} \nHere's data about this field: ${JSON.stringify(fieldQuery.fieldData)}`;
      this.askFarmingQuestion(enhancedPrompt);
    } else {
      this.askFarmingQuestion(this.chatbotPrompt);
    }

    this.chatbotPrompt = '';
  }

  askFarmingQuestion(prompt: string): void {
    this.iaDashService.askFarmingQuestion(prompt).subscribe(
      response => {
        this.loadingChatResponse = false;
        this.messages.push({
          sender: 'bot',
          content: response
        });
      },
      error => {
        this.loadingChatResponse = false;
        console.error('Error getting response:', error);
        this.messages.push({
          sender: 'bot',
          content: 'Sorry, I encountered an error processing your request.'
        });
      }
    );
  }

  private isFieldQuery(query: string): { fieldName: string, fieldData: any } | null {
    if (!this.farmData || !this.farmData.fields) return null;

    const lowercaseQuery = query.toLowerCase();

    for (const field of this.farmData.fields) {
      const fieldName = field.name.toLowerCase();
      if (lowercaseQuery.includes(fieldName)) {
        return { fieldName: field.name, fieldData: field };
      }
    }

    return null;
  }

  onRecommendCrop(): void {
    if (!this.cropInput.trim()) return;

    this.iaDashService.recommendCrop({ cropInput: this.cropInput }).subscribe(
      response => {
        this.recommendedCrop = response.recommendedCrop || response; // Adjust depending on your backend response structure
      },
      error => {
        console.error('Error recommending crop:', error);
      }
    );
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      const imageData = this.iaDashService.prepareImageData(base64Image);

      this.iaDashService.analyzeCropHealth(imageData).subscribe(
        response => {
          console.log('Crop health analysis response:', response);
          // You can store the result in a variable to display on UI
        },
        error => {
          console.error('Error analyzing crop health:', error);
        }
      );
    };
    reader.readAsDataURL(file);
  }

  loading = false;
  predictedYieldData: any = null;

  predictYield(): void {
  this.loading = true;
  this.predictedYieldData = null;

  this.iaDashService.predictYield(this.yieldPredictionData).subscribe(
    response => {
      this.predictedYieldData = response;
      this.loading = false;
    },
    error => {
      console.error('Error predicting yield:', error);
      this.loading = false;
    }
  );
}
}
