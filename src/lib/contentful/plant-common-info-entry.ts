import { Entry, EntryFields } from 'contentful';

export interface PlantCommonInfoFields {
  genus: EntryFields.Symbol;
  species: EntryFields.Symbol;
  varietyCultivar: EntryFields.Symbol;
  fullLatinName: EntryFields.Symbol;
  commonName: EntryFields.Symbol;
  width: EntryFields.Number;
  height: EntryFields.Number;
  sourceLinks: EntryFields.Symbol[];
}

export interface PlantCommonInfoEntry extends Entry<PlantCommonInfoFields> {}