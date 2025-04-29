// src/app/components/weather/weather.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WeatherService } from 'src/app/core/services/farm-managment/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, OnChanges {
  @Input() longitude: number = 0;
  @Input() latitude: number = 0;

  weatherData: any;
  loading: boolean = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // Load weather if coordinates are provided initially
    if (this.longitude && this.latitude) {
      this.getWeather(this.longitude, this.latitude);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload weather when input coordinates change
    if ((changes['longitude'] && !changes['longitude'].firstChange) || 
        (changes['latitude'] && !changes['latitude'].firstChange)) {
      this.getWeather(this.longitude, this.latitude);
    }
  }

  // Method to fetch weather data
  getWeather(x: number, y: number): void {
    this.loading = true;
    this.error = null;
    
    this.weatherService.getWeatherByCoordinates(x, y)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load weather data';
          this.loading = false;
          console.error('Error fetching weather:', err);
        }
      });
  }
}