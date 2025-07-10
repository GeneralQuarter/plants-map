import type { Feature, Polygon } from 'geojson';

export type MapSectorGeoJSON = Feature<Polygon>;

export interface MapSector {
  id: string;
  name: string;
  geojson: MapSectorGeoJSON;
  wateredAt?: Date;
}
