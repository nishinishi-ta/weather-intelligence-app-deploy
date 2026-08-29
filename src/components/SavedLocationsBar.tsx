import React from 'react';
import { Bookmark, Star, X, MapPin } from 'lucide-react';
import { GeoLocation } from '../types/weather';

interface SavedLocationsBarProps {
  favorites: GeoLocation[];
  currentCity: GeoLocation | null;
  onSelectCity: (city: GeoLocation) => void;
  onToggleFavorite: (city: GeoLocation) => void;
}

export const SavedLocationsBar: React.FC<SavedLocationsBarProps> = ({
  favorites,
  currentCity,
  onSelectCity,
  onToggleFavorite,
}) => {
  if (!currentCity && favorites.length === 0) return null;

  const isCurrentFavorite =
    currentCity &&
    favorites.some(
      (f) =>
        f.id === currentCity.id ||
        (f.name.toLowerCase() === currentCity.name.toLowerCase() &&
          f.country === currentCity.country)
    );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Saved locations pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-white/40 flex items-center gap-1 font-medium flex-shrink-0">
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
          Saved Places:
        </span>

        {favorites.length === 0 ? (
          <span className="text-white/40 italic">No saved favorites yet. Click the star to save {currentCity?.name}.</span>
        ) : (
          favorites.map((fav) => {
            const isSelected = currentCity?.name === fav.name && currentCity?.country === fav.country;
            return (
              <div
                key={fav.id}
                className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full border transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-400 text-white font-semibold shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCity(fav)}
                  className="flex items-center gap-1 hover:underline"
                >
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>{fav.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(fav)}
                  title="Remove from favorites"
                  className="p-1 text-white/40 hover:text-rose-400 rounded-full hover:bg-white/10 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Bookmark current city button */}
      {currentCity && (
        <button
          type="button"
          onClick={() => onToggleFavorite(currentCity)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition active:scale-95 font-medium ${
            isCurrentFavorite
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-white/5 border-white/10 text-white/70 hover:text-amber-300 hover:border-amber-500/30'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isCurrentFavorite ? 'fill-amber-400 text-amber-400' : 'text-white/40'
            }`}
          />
          <span>{isCurrentFavorite ? 'Saved' : 'Save Location'}</span>
        </button>
      )}
    </div>
  );
};
