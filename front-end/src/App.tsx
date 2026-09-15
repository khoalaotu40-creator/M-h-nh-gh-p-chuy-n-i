/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import GlobeView from './components/GlobeView';
import MapView from './components/MapView';
import { EncodeResult, H3Polygon } from './types';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [lat, setLat] = useState<string>('10.8700');
  const [lng, setLng] = useState<string>('106.8031');
  const [resolution, setResolution] = useState<string>('8');

  const [result, setResult] = useState<EncodeResult | null>(null);
  const [viewMode, setViewMode] = useState<'globe' | 'map'>('globe');
  const [globalGrid, setGlobalGrid] = useState<H3Polygon[]>([]);

  useEffect(() => {
    fetch('/api/location/global-grid')
      .then((res) => res.json())
      .then((data) => {
        if (data.polygons) setGlobalGrid(data.polygons);
      })
      .catch((err) => console.error('Failed to load global grid', err));
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900 overflow-hidden">
      <Sidebar
        lat={lat}
        setLat={setLat}
        lng={lng}
        setLng={setLng}
        resolution={resolution}
        setResolution={setResolution}
        result={result}
        setResult={setResult}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="hidden md:block flex-1 bg-[#040d21] relative flex items-center justify-center z-0">
        {viewMode === 'globe' ? (
          <GlobeView lat={lat} lng={lng} result={result} globalGrid={globalGrid} />
        ) : (
          <MapView lat={lat} lng={lng} result={result} />
        )}

        {/* Simple overlay to make it look nicer */}
        <div className="absolute top-4 right-4 z-10 p-3 bg-black/40 backdrop-blur-md rounded border border-white/20 pointer-events-none">
          <p className="text-white/90 text-xs font-mono">
            {result ? `H3: ${result.h3_index}` : 'Awaiting coordinates...'}
          </p>
        </div>
      </div>
    </div>
  );
}
