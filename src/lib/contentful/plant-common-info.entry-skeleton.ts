import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

type PlantCommonInfoFields = {
  genus: EntryFieldTypes.Symbol;
  species: EntryFieldTypes.Symbol;
  varietyCultivar: EntryFieldTypes.Symbol;
  fullLatinName: EntryFieldTypes.Symbol;
  commonName: EntryFieldTypes.Symbol;
  width: EntryFieldTypes.Number;
  height: EntryFieldTypes.Number;
  sourceLinks: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
};

export type PlantCommonInfoEntrySkeleton = EntrySkeletonType<
  PlantCommonInfoFields,
  'PlantCommonInfo'
>;
export type PlantCommonInfoEntry = Entry<
  PlantCommonInfoEntrySkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  'fr'
>;
