import { EntryFields, EntryWithLinkResolutionAndWithoutUnresolvableLinks } from 'contentful';
import { PlantCommonInfoEntry } from './plant-common-info-entry';

export interface PlantFields {
  commonInfo: PlantCommonInfoEntry;
  code: EntryFields.Symbol;
  position?: {lat: number, lon: number};
}

export interface PlantEntry extends EntryWithLinkResolutionAndWithoutUnresolvableLinks<PlantFields> {}