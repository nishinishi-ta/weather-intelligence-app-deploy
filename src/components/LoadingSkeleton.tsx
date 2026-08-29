import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" id="loading-skeleton">
      {/* Current weather card skeleton */}
      <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-white/10 rounded-xl" />
            <div className="h-4 w-32 bg-white/5 rounded-lg" />
          </div>
          <div className="h-8 w-28 bg-white/10 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="h-16 w-36 bg-white/10 rounded-2xl" />
              <div className="h-4 w-40 bg-white/5 rounded-lg" />
              <div className="h-3 w-64 bg-white/5 rounded-lg" />
            </div>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 border border-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Timeline skeleton */}
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-36 w-24 bg-white/5 border border-white/5 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* 2-column sections skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-[32px] bg-white/5 border border-white/10" />
        <div className="h-80 rounded-[32px] bg-white/5 border border-white/10" />
      </div>
    </div>
  );
};
