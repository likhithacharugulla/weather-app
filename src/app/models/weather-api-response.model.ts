export interface ForecastSlot {
  dt: number;
  main: ForecastMain;
  weather: ForecastWeather[];
  clouds: ForecastClouds;
  wind: ForecastWind;
  visibility: number;
  pop: number;
  sys: ForecastSys;
  dt_txt: string;
}

export interface ForecastMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface ForecastWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastClouds {
  all: number;
}

export interface ForecastWind {
  speed: number;
  deg: number;
  gust: number;
}

export interface ForecastSys {
  pod: string;
}
