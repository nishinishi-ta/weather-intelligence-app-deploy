import React from 'react';
import {
  Wind,
  Gauge,
  Droplets,
  Eye,
  Compass,
  Sunrise,
  Sunset,
  Sun,
  Shield,
  Activity,
} from 'lucide-react';
import { CurrentWeatherRaw, DailyWeatherRaw, TemperatureUnit } from '../types/weather';
import {
  formatWindSpeed,
  formatPressure,
  formatTemperature,
  getWindDirectionName,
} from '../utils/units';

interface AtmosphericDetailsCardProps {
  current: CurrentWeatherRaw;
  daily: DailyWeatherRaw;
  unit: TemperatureUnit;
}

export const AtmosphericDetailsCard: React.FC<AtmosphericDetailsCardProps> = ({
  current,
  daily,
  unit,
}) => {
  const windDir = getWindDirectionName(current.wind_direction_10m);
  const sunrise = daily.sunrise?.[0];
  const sunset = daily.sunset?.[0];

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

  // Calculate day length
  let dayLengthStr = '-- hrs';
  if (sunrise && sunset) {
    try {
      const riseDate = new Date(sunrise);
      const setDate = new Date(sunset);
      const diffMs = setDate.getTime() - riseDate.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        dayLengthStr = `${hours}h ${mins}m`;
      }
    } catch {
      // fallback
    }
  }

  return (
    <div
      id="atmospheric-details-section"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {/* Wind & Gusts Gauge */}
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Wind className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Wind & Dynamics</h4>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-500/30">
            {windDir} • {current.wind_direction_10m}°
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
            <p className="text-[11px] text-white/40">Sustained Speed</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {formatWindSpeed(current.wind_speed_10m, unit)}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5">
            <p className="text-[11px] text-white/40">Peak Gusts</p>
            <p className="text-lg font-bold text-teal-300 mt-0.5">
              {formatWindSpeed(current.wind_gusts_10m || current.wind_speed_10m * 1.3, unit)}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          {current.wind_speed_10m < 12
            ? 'Light, gentle air breeze. Calm atmospheric drag.'
            : current.wind_speed_10m < 28
            ? 'Moderate breeze; rustling tree leaves and light turbulence.'
            : 'Strong continuous breeze; expect noticeable wind resistance.'}
        </p>
      </div>

      {/* Sun & Daylight Cycle */}
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sun className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Solar Daylight Cycle</h4>
          </div>
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
            {dayLengthStr} daylight
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-2.5">
            <Sunrise className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-white/40">Sunrise</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatSunTime(sunrise)}</p>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-2.5">
            <Sunset className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-white/40">Sunset</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatSunTime(sunset)}</p>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          Solar peak radiation coincides with maximum UV exposure between 11:30 AM and 2:30 PM.
        </p>
      </div>

      {/* Barometric Pressure & Stability */}
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Gauge className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Barometric Stability</h4>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/30">
            {formatPressure(current.surface_pressure || current.pressure_msl)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40">Pressure System</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {(current.pressure_msl || current.surface_pressure) > 1015
                ? 'High Pressure (Stable)'
                : (current.pressure_msl || current.surface_pressure) < 1005
                ? 'Low Pressure (Turbulent)'
                : 'Neutral Atmospheric Gradient'}
            </p>
          </div>
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          {(current.pressure_msl || current.surface_pressure) >= 1013
            ? 'High barometric pressure promotes clear skies and steady conditions.'
            : 'Depression zone promotes moisture condensation and cloud build-up.'}
        </p>
      </div>
    </div>
  );
};
