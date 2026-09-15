import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Hexagon,
  Zap,
  Search,
  Globe as GlobeIcon,
  Map as MapIcon,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { EncodeResult, PlaceSuggestion } from '../types';

interface SidebarProps {
  lat: string;
  setLat: (val: string) => void;
  lng: string;
  setLng: (val: string) => void;
  resolution: string;
  setResolution: (val: string) => void;
  result: EncodeResult | null;
  setResult: (res: EncodeResult | null) => void;
  viewMode: 'globe' | 'map';
  setViewMode: (mode: 'globe' | 'map') => void;
}

export default function Sidebar({
  lat,
  setLat,
  lng,
  setLng,
  resolution,
  setResolution,
  result,
  setResult,
  viewMode,
  setViewMode,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/location/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Geocoding request failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectLocation = (place: PlaceSuggestion) => {
    setLat(place.lat);
    setLng(place.lon);
    setSearchQuery(place.display_name);
    setSuggestions([]);
  };

  const handleEncode = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/location/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          resolution: parseInt(resolution, 10),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'API Error');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 flex justify-center items-start overflow-y-auto overflow-x-hidden ${isOpen ? 'w-full md:w-1/3 lg:w-2/5 p-6 md:p-8' : 'w-0 p-0'}`}
      >
        <div className="w-full min-w-[320px] max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <Hexagon className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold">Uber H3</h1>
                <p className="text-xs text-gray-500">Convert Lat/Lng</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('globe')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'globe' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="3D Globe View"
                >
                  <GlobeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="2D Map View"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (!val.trim()) setSuggestions([]);
                  }}
                  placeholder="E.g., Ho Chi Minh City, Eiffel Tower..."
                  className="w-full border-gray-300 rounded-md border py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                  {suggestions.map((place, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectLocation(place)}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 transition-colors"
                    >
                      <span className="block truncate font-medium">{place.display_name}</span>
                      <span className="block truncate text-xs text-gray-500">
                        {parseFloat(place.lat).toFixed(4)}, {parseFloat(place.lon).toFixed(4)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {isSearching && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-sm rounded-md py-2 px-3 text-sm text-gray-500">
                  Searching...
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution (0-15)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Res 8 ~ 0.7km², Res 9 ~ 0.1km²</p>
            </div>

            <button
              onClick={handleEncode}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium p-2 rounded-md hover:bg-indigo-700 transition-colors flex justify-center items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{loading ? 'Encoding...' : 'Encode Coordinates'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-gray-900 rounded-lg text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">H3 Index:</span>
                <span className="font-mono text-lg text-green-400">{result.h3_index}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Processing Time:</span>
                <span className="flex items-center space-x-1 font-mono text-sm text-yellow-400">
                  <Zap className="w-3 h-3" />
                  <span>{result.processing_time_ms} ms</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toggle Button to re-open sidebar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-6 left-6 z-20 bg-white p-2.5 rounded-lg shadow-md border border-gray-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
