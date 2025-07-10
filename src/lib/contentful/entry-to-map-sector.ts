import type { MapSector } from '../../models/map-sector';
import type { MapSectorEntry } from './map-sector.entry-skeleton';

export function entryToMapSector(entry: MapSectorEntry): MapSector {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    geojson: entry.fields.geojson,
  };
}
