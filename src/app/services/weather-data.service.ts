import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ForecastSlot } from '../models/weather-api-response.model';
import { CustomWeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {
  #API_KEY: string = 'fe3695759da76e0c9dcaf566634a08ed';
  #BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  public fetchWeatherData(lat: number, lon: number) {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.#API_KEY)
      .set('units', 'metric');

    return this.http
      .get<{ city: any; list: ForecastSlot[] }>(this.#BASE_URL, { params })
      .pipe(
        map((res) => ({
          city: res.city,
          weather: this.#groupByDay(res.list),
        }))
      );
  }

  /**
   * grouping individual multiple records day wise
   * @param data
   */
  #groupByDay(data: ForecastSlot[]) {
    const grouped: Record<string, CustomWeatherResponse> = {};

    data.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]; // yyyy-mm-dd

      if (!grouped[date]) {
        grouped[date] = {
          temps: [],
          humidity: [],
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE,
          windSum: 0,
          count: 0,
          descriptions: [],
          icons: [],
          feelsLike: 0,
          cloudiness: 0,
        };
      }
      grouped[date].temps.push(item.main.temp);
      grouped[date].humidity.push(item.main.humidity);
      grouped[date].min = Math.min(grouped[date].min, item.main.temp_min);
      grouped[date].max = Math.max(grouped[date].max, item.main.temp_max);
      grouped[date].windSum += item.wind.speed;
      grouped[date].count++;
      grouped[date].descriptions.push(item.weather[0].description);
      grouped[date].icons.push(item.weather[0].icon);
      grouped[date].feelsLike = item.main.feels_like;
      grouped[date].cloudiness = item.clouds.all;
    });

    // Converting to array & picking 5 days
    return Object.keys(grouped)
      .slice(0, 5)
      .map((date) => ({
        date,
        avgTemp: +(
          grouped[date].temps.reduce((a, b) => a + b, 0) /
          grouped[date].temps.length
        ).toFixed(1),
        avgHumidity: +(
          grouped[date].humidity.reduce((a, b) => a + b, 0) /
          grouped[date].humidity.length
        ).toFixed(1),
        minTemp: grouped[date].min,
        maxTemp: grouped[date].max,
        avgWind: +(grouped[date].windSum / grouped[date].count).toFixed(1),
        description: this.#mostFrequent(grouped[date].descriptions),
        icon: this.#mostFrequent(grouped[date].icons),
        feelsLike: +(
          grouped[date].temps.reduce((a, b) => a + b, 0) /
          grouped[date].temps.length
        ).toFixed(1),
        cloudiness: grouped[date].cloudiness,
      }));
  }

  /**
   * Find the value which is most repeating
   * @param arr
   */
  #mostFrequent(arr: string[]) {
    return (
      arr
        .sort(
          (a, b) =>
            arr.filter((v) => v === a).length -
            arr.filter((v) => v === b).length
        )
        .pop() || arr[0]
    );
  }
}
