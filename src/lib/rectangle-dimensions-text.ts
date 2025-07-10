import type { Rectangle } from '../models/rectangle';

export function rectangleDimensions(rectangle: Rectangle): string {
  return `${rectangle.width} m x ${rectangle.length} m`;
}
