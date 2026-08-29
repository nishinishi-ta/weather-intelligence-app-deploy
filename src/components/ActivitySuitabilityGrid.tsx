import React from 'react';
import { ActivityScore } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Compass, Trophy } from 'lucide-react';

interface ActivitySuitabilityGridProps {
  activities: ActivityScore[];
}

export const ActivitySuitabilityGrid: React.FC<ActivitySuitabilityGridProps> = ({
  activities,
}) => {
  return (
    <div
      id="activity-suitability-section"
      className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-blue-400">
              Outdoor Activity Suitability Index
            </h3>
            <p className="text-xs text-white/50">
              Algorithmically scored based on thermal comfort, wind resistance, rain risk, and sky clarity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
            80-100: Optimal
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
            65-79: Good
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
            45-64: Fair
          </span>
        </div>
      </div>

      {/* Grid of 6 Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => {
          return (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition flex flex-col justify-between space-y-4 group shadow-sm"
            >
              {/* Top Row: Icon, Title & Rating Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-blue-400 group-hover:scale-105 transition">
                    <WeatherIcon name={act.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{act.name}</h4>
                    <p className="text-[11px] text-white/50">{act.summary}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${act.colorClass}`}
                >
                  {act.rating}
                </span>
              </div>

              {/* Progress Bar & Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/40">Condition Score</span>
                  <span className="text-white font-mono">{act.score}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : act.score >= 65
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-400'
                        : act.score >= 45
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-rose-500 to-red-400'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

              {/* Pro-Tip Box */}
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-[11px] text-white/70 flex items-start gap-2">
                <span className="font-semibold text-blue-400 flex-shrink-0">Tip:</span>
                <span className="leading-snug text-white/70">{act.tips}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
