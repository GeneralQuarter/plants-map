import { MapZone } from '../../models/map-zone';
import { MapZoneEntry } from './map-zone.entry-skeleton';

export function entryToMapZone(entry: MapZoneEntry): MapZone {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    orientation: entry.fields.orientation,
    coords: entry.fields.coords,
  };
}
