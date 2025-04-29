// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
//   })
//   export class IaDashService {
  
//     constructor(private http: HttpClient) { }


//     //doesnt work yet
//   recommendCrop(data: any): Observable<any> {
//     return this.http.post('/api/v1/ia-farm/recommend-crop', data);  // Adjusted URL
//   }



//   askFarmingQuestion(prompt: string): Observable<any> {
//     return this.http.post('/api/v1/ia-farm/ask-farming-question', { prompt });  // Adjusted URL
//   }
//   }
  
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IaDashService {
  private apiBaseUrl = '/api/v1/ia-farm';

  constructor(private http: HttpClient) { }

  recommendCrop(data: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/recommend-crop`, data)
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  askFarmingQuestion(prompt: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/ask-farming-question`, { prompt })
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  analyzeCropHealth(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post(`${this.apiBaseUrl}/analyze-crop-health`, formData)
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  predictYield(farmData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/predict-yield`, farmData)
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  optimizeResources(resourceData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/optimize-resources`, resourceData)
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  get3DFarmData(farmId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/3d-farm-data/${farmId}`)
      .pipe(
        map(response => this.parseApiResponse(response))
      );
  }

  // Helper method to parse Gemini API responses
  private parseApiResponse(response: any): any {
    // Check if the response is a string that needs parsing
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (e) {
        // If not valid JSON, return as is
        return response;
      }
    }

    // If the response is from Gemini API, extract the text content
    if (response && response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }

    // If not a special format, return as is
    return response;
  }

  // Convert base64 image to binary data for API requests
  prepareImageData(base64Image: string): any {
    // Remove data URL prefix if present
    const base64Content = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    return {
      image: base64Content,
      options: {
        wait_for_model: true
      }
    };
  }

  // Prepare farm data for yield prediction
  prepareFarmDataForYield(
    cropType: string, 
    fieldSize: number, 
    plantingDate: string, 
    soilType: string, 
    recentWeather: string
  ): any {
    return {
      cropType,
      fieldSize,
      plantingDate,
      soilType,
      recentWeather
    };
  }

  // Prepare resource data for optimization
  prepareResourceData(
    waterUsage: number,
    fertilizerUsage: number,
    energyConsumption: number,
    laborHours: number,
    cropType: string,
    fieldSize: number
  ): any {
    return {
      waterUsage,
      fertilizerUsage,
      energyConsumption,
      laborHours,
      cropType,
      fieldSize
    };
  }
}