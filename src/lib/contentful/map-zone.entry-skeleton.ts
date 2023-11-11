import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import type { CoordsJsonArray } from './coords-json-array';

type MapZoneFields = {
  name: EntryFieldTypes.Symbol,
  orientation: EntryFieldTypes.Symbol<'landscape' | 'portrait'>,
  coords: EntryFieldTypes.Object<CoordsJsonArray>;
}

export type MapZoneEntrySkeleton = EntrySkeletonType<MapZoneFields, 'mapZone'>;
export type MapZoneEntry = Entry<MapZoneEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>;
