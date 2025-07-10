import type { Rectangle } from '../../models/rectangle';
import type { RectangleEntry } from './rectangle.entry-skeleton';

export function entryToRectangle(entry: RectangleEntry): Rectangle {
  return {
    id: entry.sys.id,
    label: entry.fields.label,
    code: entry.fields.code,
    width: entry.fields.width,
    length: entry.fields.length,
    coords: entry.fields.coords,
  };
}
