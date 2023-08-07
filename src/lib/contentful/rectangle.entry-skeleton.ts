import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import type { CoordsJsonArray } from './coords-json-array';

type RectangleFields = {
  label: EntryFieldTypes.Symbol;
  code: EntryFieldTypes.Symbol;
  width: EntryFieldTypes.Number;
  length: EntryFieldTypes.Number;
  coords?: EntryFieldTypes.Object<CoordsJsonArray>;
}

export type RectangleEntrySkeleton = EntrySkeletonType<RectangleFields, 'rectangle'>;
export type RectangleEntry = Entry<RectangleEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>;
