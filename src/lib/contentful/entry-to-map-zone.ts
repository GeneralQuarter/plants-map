import type { MapZone } from '../../models/map-zone';
import type { MapZoneEntry } from './map-zone.entry-skeleton';

export function entryToMapZone(entry: MapZoneEntry): MapZone {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    orientation: entry.fields.orientation,
    coords: entry.fields.coords,
  };
}
