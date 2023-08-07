import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import type { PlantEntrySkeleton } from './plant.entry-skeleton';
import type { CoordsJsonArray } from './coords-json-array';

type HedgeFields = {
  name: EntryFieldTypes.Symbol,
  plants: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<PlantEntrySkeleton>>;
  coords: EntryFieldTypes.Object<CoordsJsonArray>;
}

export type HedgeEntrySkeleton = EntrySkeletonType<HedgeFields, 'hedge'>;
export type HedgeEntry = Entry<HedgeEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>;
