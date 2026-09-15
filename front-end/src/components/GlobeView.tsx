import { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { formatBoundary, createGlobalGridMesh } from '../utils/geoUtils';
import { EncodeResult, H3Polygon } from '../types';

interface GlobeViewProps {
  lat: string;
  lng: string;
  result: EncodeResult | null;
  globalGrid: H3Polygon[];
}

// Minimal interface for the Globe methods we use
interface GlobeMethods {
  pointOfView: (coords: { lat: number; lng: number; altitude: number }, ms: number) => void;
}

export default function GlobeView({ lat, lng, result, globalGrid }: GlobeViewProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (result && globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          altitude: 0.15,
        },
        1500
      );
    }
  }, [result, lat, lng]);

  const selectedPolygonsData = useMemo(() => {
    return result && result.polygons
      ? result.polygons.map((poly: H3Polygon) => ({
          properties: {
            h3: poly.h3_index,
            isCenter: poly.is_center,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [formatBoundary(poly.boundary)],
          },
        }))
      : [];
  }, [result]);

  return (
    <div className="absolute inset-0 z-0">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        customLayerData={globalGrid.length ? [{ polygons: globalGrid }] : []}
        customThreeObject={(d: Record<string, unknown>) =>
          createGlobalGridMesh(d.polygons as H3Polygon[])
        }
        polygonsData={selectedPolygonsData}
        polygonGeoJsonGeometry={(d: Record<string, unknown>) => d.geometry as object}
        polygonCapColor={(d: Record<string, unknown>) =>
          (d.properties as { isCenter: boolean }).isCenter
            ? 'rgba(34, 197, 94, 0.7)'
            : 'rgba(34, 197, 94, 0.2)'
        }
        polygonSideColor={() => 'transparent'}
        polygonStrokeColor={() => '#ffffff'}
        polygonAltitude={0.005}
      />
    </div>
  );
}
