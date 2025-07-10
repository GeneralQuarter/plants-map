import { generateRectangle } from './leaflet/generate-rectangle';

// A8 ratio in meters
const A8 = [52, 74];

export function generateMapZone(
  startPoint: [number, number],
  orientation: 'landscape' | 'portrait' = 'landscape',
) {
  const width = orientation === 'landscape' ? A8[1] : A8[0];
  const height = orientation === 'landscape' ? A8[0] : A8[1];

  return generateRectangle(startPoint, height, width);
}
