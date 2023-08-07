import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import type { PlantCommonInfoEntrySkeleton } from './plant-common-info.entry-skeleton';

type PlantFields = {
  commonInfo: EntryFieldTypes.EntryLink<PlantCommonInfoEntrySkeleton>;
  code: EntryFieldTypes.Symbol;
  sponsor: EntryFieldTypes.Symbol;
  position?: EntryFieldTypes.Location;
}

export type PlantEntrySkeleton = EntrySkeletonType<PlantFields, 'plant'>;
export type PlantEntry = Entry<PlantEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>;
