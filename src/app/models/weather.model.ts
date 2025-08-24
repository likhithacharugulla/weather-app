// weather.model.ts

/**
 * City option for dropdown
 */
export interface CityOption {
  city: string | null;
  label: string;
  lat: number;
  lon: number;
}

/**
 * Weather forecast entry (one per day after grouping)
 */
export interface ForecastEntry {
  date: string;
  avgTemp: number;
  avgHumidity: number;
  minTemp: number;
  maxTemp: number;
  avgWind: number;
  description: string;
  icon: string;
  feelsLike: number;
  cloudiness: number;
}

/**
 * City data returned by API
 */
export interface CityData {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

/**
 * API response shape returned by service
 */
export interface WeatherResponse {
  city: CityData;
  weather: ForecastEntry[];
}

export interface CustomWeatherResponse {
  temps: number[];
  humidity: number[];
  min: number;
  max: number;
  windSum: number;
  count: number;
  descriptions: string[];
  icons: string[];
  feelsLike: number;
  cloudiness: number;
}
