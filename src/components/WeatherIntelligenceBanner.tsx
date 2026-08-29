import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  Shirt,
  Umbrella,
  Sun,
  Wind,
  Zap,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { WeatherIntelligenceData, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/units';

interface WeatherIntelligenceBannerProps {
  intelligence: WeatherIntelligenceData;
  unit: TemperatureUnit;
}

export const WeatherIntelligenceBanner: React.FC<WeatherIntelligenceBannerProps> = ({
  intelligence,
  unit,
}) => {
  const { warnings, clothingAdvice, bestOutdoorHours, comfortIndex, generalSummary } =
    intelligence;

  const renderInsightIcon = (type: string) => {
    switch (type) {
      case 'umbrella':
        return <Umbrella className="w-4 h-4 text-cyan-400" />;
      case 'uv':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-teal-400" />;
      case 'outdoor':
        return <Zap className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      id="weather-intelligence-section"
      className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              Weather Intelligence & Advisory
            </h3>
            <p className="text-xs text-white/50">
              Condition analysis, clothing recommendations, and day planner
            </p>
          </div>
        </div>

        {/* Best Outdoor Hours Pill */}
        {bestOutdoorHours && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>
              Best Outdoor Window: <strong className="text-white">{bestOutdoorHours.start} – {bestOutdoorHours.end}</strong>
            </span>
          </div>
        )}
      </div>

      {/* General Executive Summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-white/5 to-indigo-900/30 border border-white/10 text-sm text-white/90 flex items-start gap-3.5 shadow-sm">
        <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-300 text-xs tracking-wider uppercase">Executive Summary</p>
          <p className="leading-relaxed text-white/80">{generalSummary}</p>
        </div>
      </div>

      {/* Action Warnings Grid */}
      {warnings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warnings.map((warning) => (
            <div
              key={warning.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90">
                    {renderInsightIcon(warning.type)}
                  </div>
                  <h4 className="text-xs font-semibold text-white">{warning.title}</h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${warning.badgeColor}`}
                >
                  {warning.badge}
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">{warning.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Two-Column Deep Insights: Clothing Advisory & Atmospheric Comfort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clothing & Gear Advisory */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Recommended Clothing & Gear</h4>
              <p className="text-[11px] text-white/50">Layering tailored to thermal perception</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                Outfit Layers
              </span>
              <p className="text-white/80">{clothingAdvice.layers}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                Footwear
              </span>
              <p className="text-white/80">{clothingAdvice.footwear}</p>
            </div>

            {clothingAdvice.accessories.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                  Key Accessories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {clothingAdvice.accessories.map((acc, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-white/80 text-xs border border-white/10 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comfort Index & Dew Point */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Atmospheric Comfort Index</h4>
              <p className="text-[11px] text-white/50">Dew point and air perception analysis</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/50">Air Feel Classification</p>
                <p className="text-base font-bold text-emerald-300">{comfortIndex.label}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/50">Dew Point</p>
                <p className="text-base font-bold text-white">
                  {formatTemperature(comfortIndex.dewPoint, unit)}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/70 bg-white/[0.03] p-3 rounded-xl border border-white/5 leading-relaxed">
              {comfortIndex.airFeel}. Calculated from ambient temperature and relative humidity.
            </p>

            {/* Comfort meter bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider">
                <span>Crisp & Dry</span>
                <span>Comfortable</span>
                <span>Oppressive</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
                <div className="w-1/3 bg-blue-400 h-full opacity-80" />
                <div className="w-1/3 bg-emerald-400 h-full opacity-80" />
                <div className="w-1/3 bg-rose-400 h-full opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
