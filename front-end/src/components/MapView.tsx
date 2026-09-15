import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polygon as LeafletPolygon, useMap } from "react-leaflet";
import { formatLeafletBoundary } from "../utils/geoUtils";
import { EncodeResult } from "../types";

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom() > 10 ? map.getZoom() : 13);
  }, [lat, lng, map]);
  return null;
}

interface MapViewProps {
  lat: string;
  lng: string;
  result: EncodeResult | null;
}

export default function MapView({ lat, lng, result }: MapViewProps) {
  const selectedPolygonsLeaflet = useMemo(() => {
    return result && result.polygons ? result.polygons.map((poly: any) => {
      return {
        h3: poly.h3_index,
        isCenter: poly.is_center,
        positions: formatLeafletBoundary(poly.boundary)
      };
    }) : [];
  }, [result]);

  return (
    <div className="absolute inset-0 z-0 bg-gray-100">
      <MapContainer 
        center={[parseFloat(lat), parseFloat(lng)]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater lat={parseFloat(lat)} lng={parseFloat(lng)} />
        
        {selectedPolygonsLeaflet.map((poly, idx) => (
          <LeafletPolygon 
            key={idx}
            positions={poly.positions}
            pathOptions={{
              color: poly.isCenter ? '#16a34a' : '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: poly.isCenter ? 0.7 : 0.2,
              weight: 2
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
