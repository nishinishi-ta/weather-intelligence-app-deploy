import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Compass,
  Gauge,
  CloudRain,
  Cloud,
  ArrowUp,
  ArrowDown,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  CurrentWeatherRaw,
  DailyWeatherRaw,
  GeoLocation,
  TemperatureUnit,
} from '../types/weather';
import { getWeatherCodeInfo } from '../utils/wmoCodes';
import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
  formatPressure,
  getWindDirectionName,
} from '../utils/units';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  current: CurrentWeatherRaw;
  daily: DailyWeatherRaw;
  city: GeoLocation;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  daily,
  city,
  unit,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weather_code);
  const isDay = current.is_day === 1;

  const todayMax = daily.temperature_2m_max?.[0];
  const todayMin = daily.temperature_2m_min?.[0];
  const precipitationSum = daily.precipitation_sum?.[0] ?? current.precipitation;
  const windDir = getWindDirectionName(current.wind_direction_10m);

  // Gradient based on weather code and day/night
  const gradientClass = isDay ? codeInfo.bgGradient.day : codeInfo.bgGradient.night;

  // UV risk label
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
  };

  const uvLevel = getUvLevel(current.uv_index);

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-2xl shadow-2xl transition-all duration-300"
    >
      {/* Dynamic Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-40 pointer-events-none`}
      />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8 space-y-6">
        {/* Top bar: Location & Today's Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {city.name}
              </h2>
              <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                <span>{city.admin1 ? `${city.admin1}, ` : ''}{city.country || ''}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="font-mono text-white/40">
                  {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                isDay
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {isDay ? 'Daytime' : 'Nighttime'}
            </span>
          </div>
        </div>

        {/* Main Temperature & Weather Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Huge Temp & Condition */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg sm:text-xl font-medium text-blue-200">{codeInfo.label}</p>
                <p className="text-sm text-white/60">
                  Feels like {formatTemperature(current.apparent_temperature, unit)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <WeatherIcon
                  name={codeInfo.iconName}
                  isDay={current.is_day}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                />
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-baseline">
                <span className="text-7xl sm:text-8xl md:text-9xl font-light tracking-tighter text-white">
                  {formatTemperature(current.temperature_2m, unit, false)}
                </span>
                <span className="text-3xl sm:text-4xl font-light text-blue-300 ml-1">
                  °{unit === 'fahrenheit' ? 'F' : 'C'}
                </span>
              </div>
            </div>

            {/* High & Low today & description */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium">
              <span className="flex items-center gap-1 text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-500/20">
                <ArrowUp className="w-3 h-3 text-rose-400" />
                H: {formatTemperature(todayMax, unit)}
              </span>
              <span className="flex items-center gap-1 text-blue-300 bg-blue-500/15 px-2.5 py-1 rounded-lg border border-blue-500/20">
                <ArrowDown className="w-3 h-3 text-blue-400" />
                L: {formatTemperature(todayMin, unit)}
              </span>
              <span className="text-white/60 text-xs truncate max-w-xs">
                {codeInfo.description}
              </span>
            </div>
          </div>

          {/* Right: Key atmospheric metrics in clean glass containers */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Humidity */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">Humidity</p>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-semibold text-white">{current.relative_humidity_2m}%</p>
            </div>

            {/* Wind Speed */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">Wind Speed</p>
                <Wind className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{formatWindSpeed(current.wind_speed_10m, unit)}</p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">{windDir}</p>
              </div>
            </div>

            {/* UV Index */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">UV Index</p>
                <Sun className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-yellow-400">{current.uv_index.toFixed(1)}</p>
                <p className={`text-[10px] font-semibold ${uvLevel.color}`}>{uvLevel.label}</p>
              </div>
            </div>

            {/* Pressure */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">Pressure</p>
                <Gauge className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-base font-semibold text-white">{formatPressure(current.surface_pressure || current.pressure_msl)}</p>
            </div>

            {/* Cloud Cover */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">Cloud Cover</p>
                <Cloud className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-xl font-semibold text-white">{current.cloud_cover ?? 0}%</p>
            </div>

            {/* Rain Precipitation */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-white/40 tracking-wider font-semibold">Precipitation</p>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-semibold text-white">{formatPrecipitation(precipitationSum, unit)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
