import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyWeatherRaw, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/wmoCodes';
import { formatTemperature, formatHour, formatWindSpeed } from '../utils/units';
import { WeatherIcon } from './WeatherIcon';

interface HourlyTimelineProps {
  hourly: HourlyWeatherRaw;
  unit: TemperatureUnit;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ hourly, unit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // We show 24 hours starting from the current hour or first available slice
  const now = new Date();
  const currentHourString = now.toISOString().slice(0, 13); // e.g. 2026-08-29T11

  // Find index closest to current hour
  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourString));
  if (startIndex === -1) startIndex = 0;

  const hoursToShow = 24;
  const indices = Array.from({ length: hoursToShow }, (_, i) => startIndex + i).filter(
    (i) => i < hourly.time.length
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      id="hourly-forecast-section"
      className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              24-Hour Evolution Timeline
            </h3>
            <p className="text-xs text-white/50">
              Hourly temperature progression, precipitation risk, and sky conditions
            </p>
          </div>
        </div>

        {/* Scroll Nav Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition active:scale-95 shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition active:scale-95 shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly Horizontal Scroller */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-3 pt-2 no-scrollbar scroll-smooth"
      >
        {indices.map((idx, pos) => {
          const timeStr = hourly.time[idx];
          const temp = hourly.temperature_2m[idx];
          const weatherCode = hourly.weather_code[idx];
          const precipProb = hourly.precipitation_probability?.[idx] ?? 0;
          const windSpeed = hourly.wind_speed_10m?.[idx];
          const isDay = hourly.is_day?.[idx] ?? 1;

          const codeInfo = getWeatherCodeInfo(weatherCode);
          const isNow = pos === 0;

          return (
            <div
              key={timeStr}
              className={`flex-shrink-0 w-24 sm:w-28 p-3.5 rounded-2xl flex flex-col items-center justify-between space-y-2.5 transition-all text-center border ${
                isNow
                  ? 'bg-gradient-to-b from-blue-500/20 to-indigo-600/20 border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              {/* Hour Header */}
              <div className="space-y-0.5">
                <p className={`text-xs font-bold ${isNow ? 'text-blue-300' : 'text-white/90'}`}>
                  {isNow ? 'Now' : formatHour(timeStr)}
                </p>
                <p className="text-[10px] text-white/40 truncate max-w-[80px]">
                  {codeInfo.label}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="my-1 text-blue-300">
                <WeatherIcon
                  name={codeInfo.iconName}
                  isDay={isDay}
                  className="w-7 h-7 text-blue-300"
                />
              </div>

              {/* Temperature */}
              <p className="text-base font-bold text-white">
                {formatTemperature(temp, unit)}
              </p>

              {/* Precipitation Chance */}
              <div className="w-full flex items-center justify-center gap-1 text-[11px] text-blue-300 font-medium">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span>{precipProb}%</span>
              </div>

              {/* Wind */}
              {windSpeed !== undefined && (
                <div className="text-[10px] text-white/40 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-white/40" />
                  <span>{formatWindSpeed(windSpeed, unit)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
