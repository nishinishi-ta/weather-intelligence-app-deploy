import React from 'react';
import { CloudSun, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  cityName?: string;
  lastUpdated?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isLoading,
  cityName,
  lastUpdated,
}) => {
  return (
    <header className="relative z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] flex-shrink-0">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Aura<span className="text-blue-400">Weather</span>
              </h1>
              <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Live Intel
              </span>
            </div>
            {cityName && (
              <p className="text-xs text-white/60 flex items-center gap-1 truncate max-w-[180px] sm:max-w-xs mt-0.5">
                <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span className="truncate">{cityName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium text-white/90">{cityName || 'Global Forecast'}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sync Active
              </p>
            </div>
          )}

          {/* Refresh Button */}
          <button
            id="btn-refresh-weather"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh current forecast"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition disabled:opacity-50 flex items-center justify-center active:scale-95 shadow-sm"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Unit Toggle Switch */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10 text-xs font-bold shadow-inner">
            <button
              id="btn-unit-celsius"
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              className={`px-3 py-1 rounded-lg transition text-xs font-bold ${
                unit === 'celsius'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="btn-unit-fahrenheit"
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              className={`px-3 py-1 rounded-lg transition text-xs font-bold ${
                unit === 'fahrenheit'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
