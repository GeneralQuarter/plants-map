import { LatLng } from 'leaflet';

export function distanceTo(
  a: [lat: number, lon: number],
  b: [lat: number, lon: number],
) {
  return new LatLng(a[0], a[1]).distanceTo(new LatLng(b[0], b[1]));
}
