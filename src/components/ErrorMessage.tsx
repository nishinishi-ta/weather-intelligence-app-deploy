import React from 'react';
import { AlertTriangle, RefreshCw, MapPinOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onSelectFallbackCity?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onSelectFallbackCity,
}) => {
  return (
    <div
      id="weather-error-banner"
      className="p-8 rounded-[32px] bg-white/5 border border-rose-500/30 backdrop-blur-xl text-center space-y-4 max-w-xl mx-auto shadow-2xl"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white tracking-tight">Unable to Fetch Weather</h3>
        <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {onSelectFallbackCity && (
          <button
            type="button"
            onClick={onSelectFallbackCity}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 font-semibold text-xs transition active:scale-95"
          >
            Load London Weather
          </button>
        )}
      </div>
    </div>
  );
};
