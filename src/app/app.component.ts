import { Component } from '@angular/core';
import { WeatherDisplayComponent } from './components/weather-display/weather-display.component';

@Component({
  selector: 'app-root',
  imports: [WeatherDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weather_app';
}
