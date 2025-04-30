import { Component, OnInit } from '@angular/core';
import { FarmService } from '../../../core/services/farm-managment/farm.service';
import { CropService } from '../../../core/services/farm-managment/crop.service';
import { ProductService } from '../../../core/services/product.service';
import { EventServiceService } from '../../../core/services/event-service.service';
import { WeatherService } from '../../../core/services/farm-managment/weather.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Statistics counters
  farmCount: number = 0;
  cropCount: number = 0;
  eventCount: number = 0;
  productCount: number = 0;
  
  // Loading states
  isLoading: boolean = true;
  loadingError: boolean = false;

  // Upcoming events
  upcomingEvents: any[] = [];
  
  // Current date for weather card
  currentDate: Date = new Date();
  
  // Weather data
  weatherData: any;
  weatherLoading: boolean = true;
  weatherError: boolean = false;
  geoLocationError: string = '';
  
  // Location coordinates (default values as fallback)
  longitude: number = 10.5333; // Default longitude (Messadine)
  latitude: number = 35.7333;  // Default latitude (Messadine)

  constructor(
    private farmService: FarmService,
    private cropService: CropService,
    private productService: ProductService,
    private eventService: EventServiceService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.getCurrentPosition();
    this.loadDashboardData();
  }

  /**
   * Get the user's current geolocation position
   */
  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update coordinates with current position
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log(`Current position: Lat ${this.latitude}, Lon ${this.longitude}`);
          
          // Load weather data after getting position
          this.loadWeatherData();
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.geoLocationError = this.getGeoLocationErrorMessage(error.code);
          
          // Load weather with default coordinates on error
          this.loadWeatherData();
        },
        { timeout: 10000 }
      );
    } else {
      this.geoLocationError = 'Geolocation is not supported by this browser';
      console.error(this.geoLocationError);
      
      // Load weather with default coordinates if geolocation is not supported
      this.loadWeatherData();
    }
  }

  /**
   * Get a human-readable error message for geolocation errors
   */
  getGeoLocationErrorMessage(errorCode: number): string {
    switch(errorCode) {
      case 1: return 'Permission denied. Please allow location access to get local weather.';
      case 2: return 'Position unavailable. Using default location instead.';
      case 3: return 'Timeout getting location. Using default location instead.';
      default: return 'Unknown error getting location.';
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.loadingError = false;

    // Using forkJoin to make all API calls in parallel
    forkJoin({
      farms: this.farmService.getFarms(),
      crops: this.cropService.getCrops(),
      events: this.eventService.getEvents(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: (results) => {
        this.farmCount = results.farms.length;
        this.cropCount = results.crops.length;
        this.eventCount = results.events.length;
        this.productCount = results.products.length;
        
        // Get upcoming events (events with dates in the future)
        this.upcomingEvents = results.events
          .filter(event => {
            // Check if the event date is in the future
            const eventDate = new Date(event.startDate);
            return eventDate > new Date();
          })
          .sort((a, b) => {
            // Sort by date (soonest first)
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          })
          .slice(0, 3); // Take only the first 3 upcoming events
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loadingError = true;
        this.isLoading = false;
      }
    });
  }
  
  loadWeatherData(): void {
    this.weatherLoading = true;
    this.weatherError = false;
    
    this.weatherService.getWeatherByCoordinates(this.longitude, this.latitude)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.weatherLoading = false;
        },
        error: (error) => {
          console.error('Error loading weather data:', error);
          this.weatherError = true;
          this.weatherLoading = false;
        }
      });
  }
}
