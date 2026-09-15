import { useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import { formatBoundary, createGlobalGridMesh } from "../utils/geoUtils";
import { EncodeResult } from "../types";

interface GlobeViewProps {
  lat: string;
  lng: string;
  result: EncodeResult | null;
  globalGrid: any[];
}

export default function GlobeView({ lat, lng, result, globalGrid }: GlobeViewProps) {
  const globeEl = useRef<any>();

  useEffect(() => {
    if (result && globeEl.current) {
      globeEl.current.pointOfView({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        altitude: 0.15
      }, 1500);
    }
  }, [result, lat, lng]);

  const selectedPolygonsData = useMemo(() => {
    return result && result.polygons ? result.polygons.map((poly: any) => ({
      properties: { 
        h3: poly.h3_index,
        isCenter: poly.is_center
      },
      geometry: {
        type: "Polygon",
        coordinates: [formatBoundary(poly.boundary)]
      }
    })) : [];
  }, [result]);

  return (
    <div className="absolute inset-0 z-0">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        customLayerData={globalGrid.length ? [{ polygons: globalGrid }] : []}
        customThreeObject={(d: any) => createGlobalGridMesh(d.polygons)}
        polygonsData={selectedPolygonsData}
        polygonGeoJsonGeometry={(d: any) => d.geometry}
        polygonCapColor={(d: any) => d.properties.isCenter ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.2)'}
        polygonSideColor={() => 'transparent'}
        polygonStrokeColor={() => '#ffffff'}
        polygonAltitude={0.005}
      />
    </div>
  );
}
