/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GeoLocation,
  TemperatureUnit,
  WeatherApiResponse,
  WeatherIntelligenceData,
} from './types/weather';
import { fetchWeatherData, DEFAULT_POPULAR_CITIES } from './services/weatherApi';
import { generateWeatherIntelligence } from './utils/weatherIntelligence';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SavedLocationsBar } from './components/SavedLocationsBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyTimeline } from './components/HourlyTimeline';
import { WeatherIntelligenceBanner } from './components/WeatherIntelligenceBanner';
import { ActivitySuitabilityGrid } from './components/ActivitySuitabilityGrid';
import { DailyForecastCard } from './components/DailyForecastCard';
import { AtmosphericDetailsCard } from './components/AtmosphericDetailsCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';

const STORAGE_KEY_UNIT = 'weather_intelligence_unit';
const STORAGE_KEY_FAVORITES = 'weather_intelligence_favorites';
const STORAGE_KEY_LAST_CITY = 'weather_intelligence_last_city';

export default function App() {
  // 1. App State
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === 'fahrenheit' || saved === 'celsius' ? saved : 'celsius';
  });

  const [currentCity, setCurrentCity] = useState<GeoLocation>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_CITY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_POPULAR_CITIES[0]; // New York or London default
  });

  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [DEFAULT_POPULAR_CITIES[0], DEFAULT_POPULAR_CITIES[1], DEFAULT_POPULAR_CITIES[2]];
  });

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 2. Persist Unit Changes
  const handleToggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      localStorage.setItem(STORAGE_KEY_UNIT, next);
      return next;
    });
  };

  // 3. Persist Favorites
  const handleToggleFavorite = (city: GeoLocation) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          f.id === city.id ||
          (f.name.toLowerCase() === city.name.toLowerCase() && f.country === city.country)
      );
      let updated: GeoLocation[];
      if (exists) {
        updated = prev.filter(
          (f) =>
            !(
              f.id === city.id ||
              (f.name.toLowerCase() === city.name.toLowerCase() && f.country === city.country)
            )
        );
      } else {
        updated = [...prev, city];
      }
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Fetch Weather Data for City
  const loadWeather = useCallback(async (city: GeoLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude, city.timezone);
      setWeatherData(data);
      setLastUpdated(new Date());
      localStorage.setItem(STORAGE_KEY_LAST_CITY, JSON.stringify(city));
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(
        `Could not retrieve live weather for ${city.name}. Open-Meteo services may be temporarily unreachable. Please retry.`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 5. Initial load and when currentCity changes
  useEffect(() => {
    if (currentCity) {
      loadWeather(currentCity);
    }
  }, [currentCity, loadWeather]);

  // 6. Geolocation detection
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const localCity: GeoLocation = {
          id: Math.floor(Date.now()),
          name: 'My Current Location',
          latitude,
          longitude,
          country: 'Local GPS Device',
        };
        setCurrentCity(localCity);
        setIsLocating(false);
      },
      (geoError) => {
        setIsLocating(false);
        console.warn('Geolocation error:', geoError);
        alert(
          'Location access was declined or unavailable. Please use the search bar to find your city.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 7. Calculate Weather Intelligence
  const intelligence: WeatherIntelligenceData | null = useMemo(() => {
    if (!weatherData) return null;
    return generateWeatherIntelligence(
      weatherData.current,
      weatherData.hourly,
      weatherData.daily
    );
  }, [weatherData]);

  return (
    <div className="min-h-screen bg-[#0A0D17] text-white flex flex-col selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Immersive Atmospheric Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1E3A8A_0%,transparent_45%),radial-gradient(circle_at_80%_80%,#1E1B4B_0%,transparent_45%)] opacity-30" />
      </div>

      {/* App Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => currentCity && loadWeather(currentCity)}
        isLoading={isLoading}
        cityName={currentCity?.name}
        lastUpdated={lastUpdated}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Location Bar */}
        <section className="space-y-3">
          <SearchBar
            onSelectCity={(city) => setCurrentCity(city)}
            onUseGeolocation={handleUseGeolocation}
            isLocating={isLocating}
            selectedCity={currentCity}
          />
          <SavedLocationsBar
            favorites={favorites}
            currentCity={currentCity}
            onSelectCity={(city) => setCurrentCity(city)}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>

        {/* Loading State */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorMessage
            message={error}
            onRetry={() => currentCity && loadWeather(currentCity)}
            onSelectFallbackCity={() => setCurrentCity(DEFAULT_POPULAR_CITIES[1])}
          />
        )}

        {/* Live Weather Content */}
        {weatherData && currentCity && (
          <div className="space-y-6 transition-all duration-300">
            {/* Primary Current Weather Hero Card */}
            <CurrentWeatherCard
              current={weatherData.current}
              daily={weatherData.daily}
              city={currentCity}
              unit={unit}
            />

            {/* 24-Hour Hourly Timeline */}
            <HourlyTimeline hourly={weatherData.hourly} unit={unit} />

            {/* Weather Intelligence & Planning Advisory Banner */}
            {intelligence && (
              <WeatherIntelligenceBanner intelligence={intelligence} unit={unit} />
            )}

            {/* Outdoor Activity Suitability Grid */}
            {intelligence && (
              <ActivitySuitabilityGrid activities={intelligence.activityScores} />
            )}

            {/* 7-Day Daily Forecast Outlook */}
            <DailyForecastCard daily={weatherData.daily} unit={unit} />

            {/* Atmospheric Details, Wind, and Solar Cycle */}
            <AtmosphericDetailsCard
              current={weatherData.current}
              daily={weatherData.daily}
              unit={unit}
            />
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-white/[0.02] backdrop-blur-md py-6 text-center text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] inline-block"></span>
            Aura Weather Intelligence • Powered by Open-Meteo High-Resolution Forecasting
          </p>
          <p className="text-white/40">Atmospheric modeling, real-time analytics & day planning</p>
        </div>
      </footer>
    </div>
  );
}
