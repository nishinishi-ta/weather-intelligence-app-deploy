export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';
export type PrecipitationUnit = 'mm' | 'inch';

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeoLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeatherRaw {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number; // 1 = day, 0 = night
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index: number;
}

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  uv_index: number[];
  is_day: number[];
}

export interface DailyWeatherRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeatherRaw;
  hourly: HourlyWeatherRaw;
  daily: DailyWeatherRaw;
}

export interface WeatherCodeInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  severity: 'calm' | 'moderate' | 'warning' | 'severe';
  bgGradient: {
    day: string;
    night: string;
  };
  cardAccent: string;
}

export interface ActivityScore {
  id: string;
  name: string;
  icon: string;
  score: number; // 0 - 100
  rating: 'Optimal' | 'Good' | 'Fair' | 'Poor';
  summary: string;
  tips: string;
  bestTime?: string;
  colorClass: string;
}

export interface WeatherInsight {
  id: string;
  type: 'clothing' | 'umbrella' | 'uv' | 'wind' | 'temp' | 'outdoor';
  title: string;
  message: string;
  badge: string;
  badgeColor: string;
  icon: string;
}

export interface WeatherIntelligenceData {
  generalSummary: string;
  comfortIndex: {
    label: string;
    score: number; // 0-100
    dewPoint: number;
    airFeel: string;
  };
  clothingAdvice: {
    layers: string;
    footwear: string;
    accessories: string[];
  };
  warnings: WeatherInsight[];
  activityScores: ActivityScore[];
  bestOutdoorHours: {
    start: string;
    end: string;
    reason: string;
  } | null;
}
