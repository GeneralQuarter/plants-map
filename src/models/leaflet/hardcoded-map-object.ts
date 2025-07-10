import type { LatLngExpression, PathOptions } from 'leaflet';

export interface HardcodedMapObject {
  positions: LatLngExpression[];
  pathOptions: PathOptions;
  label: string;
}
