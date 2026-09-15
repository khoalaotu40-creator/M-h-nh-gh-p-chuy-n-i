import * as THREE from "three";
import { BoundaryPoint } from "../types";

export const formatBoundary = (boundary: BoundaryPoint[]) => {
  if (!boundary || boundary.length === 0) return [];
  const fixed = [{ ...boundary[0] }];
  for (let i = 1; i < boundary.length; i++) {
    let prevLng = fixed[i - 1].lng;
    let currLng = boundary[i].lng;
    if (currLng - prevLng > 180) currLng -= 360;
    else if (prevLng - currLng > 180) currLng += 360;
    fixed.push({ lat: boundary[i].lat, lng: currLng });
  }
  
  // Close polygon
  let firstLng = fixed[0].lng;
  let lastLng = fixed[fixed.length - 1].lng;
  if (firstLng - lastLng > 180) firstLng -= 360;
  else if (lastLng - firstLng > 180) firstLng += 360;
  fixed.push({ lat: fixed[0].lat, lng: firstLng });
  
  const coords = fixed.map(p => [p.lng, p.lat]);
  // Reverse coordinates to fix winding order (prevent the polygon from wrapping the entire globe)
  return coords.reverse();
};

export const formatLeafletBoundary = (boundary: BoundaryPoint[]): [number, number][] => {
  if (!boundary || boundary.length === 0) return [];
  const fixed = [{ ...boundary[0] }];
  for (let i = 1; i < boundary.length; i++) {
    let prevLng = fixed[i - 1].lng;
    let currLng = boundary[i].lng;
    if (currLng - prevLng > 180) currLng -= 360;
    else if (prevLng - currLng > 180) currLng += 360;
    fixed.push({ lat: boundary[i].lat, lng: currLng });
  }
  return fixed.map(p => [p.lat, p.lng] as [number, number]);
};

export const createGlobalGridMesh = (polygons: any[]) => {
  const lineVertices: number[] = [];
  const r = 100.2; // slightly above surface (100)

  polygons.forEach((poly: any) => {
    const b = poly.boundary;
    if (!b || b.length === 0) return;
    
    for (let i = 0; i < b.length; i++) {
      const p1 = b[i];
      const p2 = b[(i + 1) % b.length];
      
      // Skip lines that cross the antimeridian to avoid glitch lines through the earth
      if (Math.abs(p1.lng - p2.lng) > 180) continue;
      
      // Convert to Cartesian
      const phi1 = (90 - p1.lat) * (Math.PI / 180);
      const theta1 = (p1.lng + 180) * (Math.PI / 180);
      const phi2 = (90 - p2.lat) * (Math.PI / 180);
      const theta2 = (p2.lng + 180) * (Math.PI / 180);
      
      lineVertices.push(
        -(r * Math.sin(phi1) * Math.cos(theta1)),
        r * Math.cos(phi1),
        r * Math.sin(phi1) * Math.sin(theta1)
      );
      lineVertices.push(
        -(r * Math.sin(phi2) * Math.cos(theta2)),
        r * Math.cos(phi2),
        r * Math.sin(phi2) * Math.sin(theta2)
      );
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
  return new THREE.LineSegments(geometry, material);
};
