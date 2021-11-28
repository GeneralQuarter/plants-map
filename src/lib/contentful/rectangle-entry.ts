import { Entry, EntryFields } from 'contentful';

export interface RectangleFields {
  label: EntryFields.Symbol;
  width: EntryFields.Number;
  length: EntryFields.Number;
  coords?: [lat: number, lon: number][];
}

export interface RectangleEntry extends Entry<RectangleFields> {}