import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation, Globe } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { searchCities, DEFAULT_POPULAR_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocation) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  selectedCity?: GeoLocation | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseGeolocation,
  isLocating,
  selectedCity,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setSearchError(null);
      try {
        const data = await searchCities(query);
        setResults(data);
        if (data.length === 0) {
          setSearchError(`No cities found matching "${query}". Check spelling.`);
        }
        setIsOpen(true);
      } catch (err) {
        setSearchError('Failed to search locations. Check internet connection.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/40" />
            )}
          </div>

          <input
            ref={inputRef}
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search global cities (e.g. Tokyo, Paris, Vancouver, New York)..."
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/40 text-sm shadow-lg backdrop-blur-xl transition duration-150"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <button
          id="btn-use-geolocation"
          type="button"
          onClick={onUseGeolocation}
          disabled={isLocating}
          title="Use current GPS location"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white/90 text-sm font-medium transition active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-md backdrop-blur-xl"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <Navigation className="w-4 h-4 text-blue-400" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (results.length > 0 || searchError) && (
        <div className="absolute left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50">
          <div className="bg-[#0A0D17]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-white/10 max-h-80 overflow-y-auto">
            {searchError && (
              <div className="p-4 text-sm text-white/50 flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/40 flex-shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {results.map((city, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={`${city.id}-${index}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
                    isSelected ? 'bg-blue-600/20 text-white' : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {city.name}
                        {city.admin1 && <span className="text-white/50 font-normal ml-1">({city.admin1})</span>}
                      </p>
                      <p className="text-xs text-white/40">
                        {city.country || 'Global Location'}
                        {city.elevation !== undefined && ` • ${Math.round(city.elevation)}m alt`}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-white/40 font-mono">
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular City Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-white/40 font-medium flex items-center gap-1 flex-shrink-0">
          <Globe className="w-3.5 h-3.5 text-white/40" />
          Popular:
        </span>
        {DEFAULT_POPULAR_CITIES.map((city) => {
          const isCurrent = selectedCity?.name === city.name && selectedCity?.country === city.country;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1 rounded-full border transition flex-shrink-0 flex items-center gap-1 font-medium ${
                isCurrent
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
