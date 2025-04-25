// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'ffc6f0a637b78f337a2c116c4931fcbe'; // Replace with your actual API key
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  /**
   * Get weather data by coordinates
   * @param lon Longitude (x coordinate)
   * @param lat Latitude (y coordinate)
   * @param units Units of measurement. 'metric' for Celsius, 'imperial' for Fahrenheit
   */
  getWeatherByCoordinates(lon: number, lat: number, units: string = 'metric'): Observable<any> {
    const params = {
      lon: lon.toString(),
      lat: lat.toString(),
      appid: this.apiKey,
      units: units
    };

    return this.http.get(this.apiUrl, { params });
  }
}