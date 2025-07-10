import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import type { CoordsJsonArray } from './coords-json-array';
import type { PlantEntrySkeleton } from './plant.entry-skeleton';

type HedgeFields = {
  name: EntryFieldTypes.Symbol;
  plants: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<PlantEntrySkeleton>>;
  coords: EntryFieldTypes.Object<CoordsJsonArray>;
};

export type HedgeEntrySkeleton = EntrySkeletonType<HedgeFields, 'hedge'>;
export type HedgeEntry = Entry<
  HedgeEntrySkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  'fr'
>;
