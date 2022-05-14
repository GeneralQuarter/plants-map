import { EntryFields, EntryWithLinkResolutionAndWithoutUnresolvableLinks } from 'contentful';
import { PlantEntry } from './plant-entry';

export interface HedgeFields {
  name: EntryFields.Symbol,
  plants: PlantEntry[];
}

export interface HedgeEntry extends EntryWithLinkResolutionAndWithoutUnresolvableLinks<HedgeFields> {}