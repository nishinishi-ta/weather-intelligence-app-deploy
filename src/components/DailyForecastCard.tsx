import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyWeatherRaw, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/wmoCodes';
import {
  formatTemperature,
  formatDayName,
  formatPrecipitation,
  formatWindSpeed,
} from '../utils/units';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastCardProps {
  daily: DailyWeatherRaw;
  unit: TemperatureUnit;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ daily, unit }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Compute global min and max across all 7 days for the temperature range visual bar
  const allMins = daily.temperature_2m_min || [];
  const allMaxs = daily.temperature_2m_max || [];
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempSpan = Math.max(1, globalMax - globalMin);

  const toggleExpand = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <div
      id="daily-forecast-section"
      className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-blue-400">
              7-Day Synoptic Outlook
            </h3>
            <p className="text-xs text-white/50">
              Extended thermal trajectory, precipitation forecasts, and daylight windows
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          7 Days
        </span>
      </div>

      {/* 7-Day List */}
      <div className="space-y-2.5">
        {daily.time.map((dateStr, index) => {
          const isToday = index === 0;
          const dayName = formatDayName(dateStr, isToday);
          const weatherCode = daily.weather_code[index];
          const codeInfo = getWeatherCodeInfo(weatherCode);
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const rainProb = daily.precipitation_probability_max?.[index] ?? 0;
          const rainSum = daily.precipitation_sum?.[index] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[index];
          const sunrise = daily.sunrise?.[index];
          const sunset = daily.sunset?.[index];
          const uvMax = daily.uv_index_max?.[index];

          // Calculate offset percentages for temperature bar
          const leftPercent = ((minTemp - globalMin) / tempSpan) * 100;
          const widthPercent = ((maxTemp - minTemp) / tempSpan) * 100;

          const isExpanded = expandedDay === index;

          const formatSunTime = (timeStr?: string) => {
            if (!timeStr) return '--:--';
            try {
              const d = new Date(timeStr);
              return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              }).format(d);
            } catch {
              return timeStr.slice(11, 16);
            }
          };

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isToday
                  ? 'bg-blue-500/10 border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              {/* Row Header / Bar */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
              >
                {/* Day name & Weather Summary */}
                <div className="flex items-center gap-3.5 min-w-[170px]">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-blue-400 flex-shrink-0">
                    <WeatherIcon name={codeInfo.iconName} className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{dayName}</span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/50 block truncate max-w-[140px]">
                      {codeInfo.label}
                    </span>
                  </div>
                </div>

                {/* Rain Probability Pill */}
                <div className="flex items-center gap-1.5 text-xs text-blue-300 sm:w-20">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono">{rainProb}%</span>
                </div>

                {/* Temperature Range Progress Bar */}
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xs font-semibold text-blue-300 w-10 text-right">
                    {formatTemperature(minTemp, unit, false)}°
                  </span>

                  <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-rose-400"
                      style={{
                        left: `${Math.max(0, leftPercent)}%`,
                        width: `${Math.max(8, widthPercent)}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-rose-300 w-10">
                    {formatTemperature(maxTemp, unit, false)}°
                  </span>
                </div>

                {/* Toggle chevron */}
                <div className="text-white/40 pl-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expandable Day Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-black/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                    <Sunrise className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40">Sunrise</p>
                      <p className="font-semibold text-white">{formatSunTime(sunrise)}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                    <Sunset className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40">Sunset</p>
                      <p className="font-semibold text-white">{formatSunTime(sunset)}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40">Max Wind</p>
                      <p className="font-semibold text-white">{formatWindSpeed(windMax, unit)}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/40">Max UV Index</p>
                      <p className="font-semibold text-white">{uvMax ? uvMax.toFixed(1) : '--'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
