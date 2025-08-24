import { Component, inject } from '@angular/core';
import { WeatherDataService } from './../../services/weather-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CityData, CityOption, ForecastEntry, WeatherResponse } from '../../models/weather.model';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss'],
  imports: [FormsModule,CommonModule]
})
export class WeatherDisplayComponent {
  /**
   * dropdown cities for selection
   */
  public cities : CityOption[] = [
    { city: null, label: 'Select city', lat: 0, lon: 0 },
    { city: 'Birmingham', label: 'Birmingham', lat: 52.4862, lon: -1.8904 },
    { city: 'London', label: 'London', lat: 51.5072, lon: -0.1276 },
    { city: 'Cardiff', label: 'Cardiff', lat: 51.4816, lon: -3.1791 }
  ];
  /**
   * city selected from dropdown
   */
  public selectedCity: CityOption = this.cities[0];
  /**
   * Forecasted weather data
   */
  public forecast: ForecastEntry[] = [];
  /**
   * city data
   */
  public cityData!: CityData | null;
  /**
   * weather suggestion
   */
  public todaySuggestion: string="";
  /**
   * error messge to be displayed during error
   */
  public errorMessage: string="";
  /**
   * check if error occured
   */
  public errorOccured: boolean = false;
  /**
   * @inject WeatherDataService
   */
  #weatherService: WeatherDataService = inject(WeatherDataService);

  /**
   * @summary weather forecast data on city selection change
   */
  public onCityChange():void {
    this.errorOccured = false
    if (!this.selectedCity?.city) {
      this.forecast = [];
      return;
    }

  this.#weatherService.fetchWeatherData(this.selectedCity.lat, this.selectedCity.lon)
   .subscribe({
    next: (data: WeatherResponse) => {
      this.forecast = data.weather;
      this.cityData = data.city;
      this.getCityLocalTime();

      if (this.forecast.length > 0) {
        const current = this.forecast[0]; // suggestion for today card
        this.todaySuggestion = this.#generateSuggestionFromIcon(current);
      } else {
        this.todaySuggestion = "No forecast data available.";
      }
      this.errorOccured = false
    },
    error: () => {
      this.errorOccured = true
      this.forecast = [];
      this.cityData = null;
      this.errorMessage = "Unable to fetch weather data. Please try again later.";
    }
  });
  }

  /**
   * @summary get the local time of city
   */
  public getCityLocalTime(){
  const timezoneOffset: number = this.cityData?.timezone ?? 0;
  const utcTime:number = Date.now() + new Date().getTimezoneOffset() * 60000;
  const localTime:Date = new Date(utcTime + timezoneOffset * 1000);

  return localTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  }

  /**
   * @summary generate weather suggestion based on description and icon
   * @param slot 
   * @returns string
   */
  #generateSuggestionFromIcon(slot: ForecastEntry): string {
  const icon = slot.icon;
  //  icon categories
  switch (true) {
    case ['01d','01n'].includes(icon):
      return  "Clear skies, safe to travel today.";
    case ['02d','02n'].includes(icon):
      return  "Mostly clear, good for travel.";
    case ['03d','03n'].includes(icon):
      return  "Cloudy but safe to travel.";
    case ['04d','04n'].includes(icon):
      return  "Overcast skies — carry light jacket.";
    case ['09d','09n','10d','10n'].includes(icon):
      return  "Rain expected — better carry an umbrella.";
    case ['11d','11n'].includes(icon):
      return  "Thunderstorms — avoid unnecessary travel.";
    case ['13d','13n'].includes(icon):
      return  "Snowy conditions — drive safe.";
    case ['50d','50n'].includes(icon):
      return  "Foggy — drive cautiously.";
  }

  return "Pleasant day!";
}
}
