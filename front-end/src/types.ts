export interface BoundaryPoint {
  lat: number;
  lng: number;
}

export interface H3Polygon {
  h3_index: string;
  boundary: BoundaryPoint[];
  is_center: boolean;
}

export interface EncodeResult {
  h3_index: string;
  processing_time_ms: number;
  polygons: H3Polygon[];
}

export interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}
