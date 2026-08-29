import { GeocodingResponse, GeoLocation, WeatherApiResponse } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();
  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }
    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone = 'auto'
): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: timezone || 'auto',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather forecast request failed with status: ${response.status}`);
    }
    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Popular quick selection cities
export const DEFAULT_POPULAR_CITIES: GeoLocation[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    timezone: 'America/New_York',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    timezone: 'Europe/London',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney',
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.2897,
    longitude: 103.8501,
    country: 'Singapore',
    country_code: 'SG',
    timezone: 'Asia/Singapore',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0772,
    longitude: 55.3093,
    country: 'United Arab Emirates',
    country_code: 'AE',
    admin1: 'Dubai',
    timezone: 'Asia/Dubai',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
    timezone: 'America/Los_Angeles',
  },
];
