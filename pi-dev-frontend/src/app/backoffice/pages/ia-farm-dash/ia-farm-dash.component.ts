import { Component, OnInit } from '@angular/core';
import { FarmService } from 'src/app/core/services/farm-managment/farm.service';
import { IaDashService } from 'src/app/core/services/farm-managment/ia-dash.service';
import { Farm } from 'src/app/core/models/famrs/farm';

@Component({
  selector: 'app-ia-farm-dash',
  templateUrl: './ia-farm-dash.component.html',
  styleUrls: ['./ia-farm-dash.component.css']
})
export class IaFarmDashComponent implements OnInit {
  farms: Farm[] = [];
  selectedFarm: Farm | null = null;
  farmData: any = null;

  selectedField: any = null;

  chatbotPrompt: string = '';
  chatbotResponse: string = '';
  messages: { sender: string, content: string }[] = [];
  loadingChatResponse: boolean = false;

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

  loading = false;
  predictedYieldData: any = null;

  constructor(
    private iaDashService: IaDashService,
    private farmService: FarmService
  ) {}

  ngOnInit(): void {
    this.fetchFarms();
  }

  fetchFarms(): void {
    this.farmService.getFarms().subscribe(
      (farms: Farm[]) => {
        this.farms = farms;
        if (farms.length > 0) {
          this.selectedFarm = farms[0];
          this.fetchFarmData();
        }
      },
      error => {
        console.error('Error fetching farms:', error);
      }
    );
  }

  onFarmSelect(farm: Farm): void {
    this.selectedFarm = farm;
  }

  fetchFarmData(): void {
    if (this.selectedFarm) {
      this.farmService.getFarmById(this.selectedFarm.uuid_farm).subscribe(
        (data) => {
          console.log('Fetched farm data:', data); // Debugging log
          this.farmData = data;
        },
        (error) => {
          console.error('Error fetching farm data:', error);
        }
      );
    }
  }

  sendChatMessage(): void {
    if (!this.chatbotPrompt.trim()) return;

    this.messages.push({ sender: 'user', content: this.chatbotPrompt });
    this.loadingChatResponse = true;

    const fieldQuery = this.isFieldQuery(this.chatbotPrompt);

    const promptToSend = fieldQuery
      ? `${this.chatbotPrompt}\nHere's data about this field: ${JSON.stringify(fieldQuery.fieldData)}`
      : this.chatbotPrompt;

    this.askFarmingQuestion(promptToSend);
    this.chatbotPrompt = '';
  }

  askFarmingQuestion(prompt: string): void {
    this.iaDashService.askFarmingQuestion(prompt).subscribe(
      response => {
        this.loadingChatResponse = false;
        this.messages.push({ sender: 'bot', content: response });
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

  private isFieldQuery(query: string): { fieldName: string; fieldData: any } | null {
    if (!this.farmData || !this.farmData.fields) return null;

    const lowercaseQuery = query.toLowerCase();

    for (const field of this.farmData.fields) {
      if (lowercaseQuery.includes(field.name.toLowerCase())) {
        return { fieldName: field.name, fieldData: field };
      }
    }

    return null;
  }

  onRecommendCrop(): void {
    if (!this.cropInput.trim()) return;

    this.iaDashService.recommendCrop({ cropInput: this.cropInput }).subscribe(
      response => {
        this.recommendedCrop = response.recommendedCrop || response;
      },
      error => {
        console.error('Error recommending crop:', error);
      }
    );
  }

selectedFile: File | null = null;
analysisResult: any = null;

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  this.selectedFile = input.files[0];
}
analysisLoading: boolean = false;


analyzeSelectedImage(): void {
  if (!this.selectedFile) return;

  this.analysisLoading = true; // Start analysisLoading

  this.iaDashService.analyzeCropHealth(this.selectedFile).subscribe(
    response => {
      console.log('Crop health analysis response:', response);

      this.analysisResult = response.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
      this.analysisLoading = false; // Stop analysisLoading
    },
    error => {
      console.error('Error analyzing crop health:', error);

      this.analysisResult = { error: 'Failed to analyze crop health.' };
      this.analysisLoading = false; // Stop analysisLoading even on error
    }
  );
}

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
