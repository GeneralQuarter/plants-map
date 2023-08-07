import type { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToRectangle } from './entry-to-rectangle';
import type { RectangleEntrySkeleton } from './rectangle.entry-skeleton';

export async function getRectanglesWithCoords(cdaClient: ContentfulClientApi<undefined>) {
  const collection = await cdaClient.withoutUnresolvableLinks.getEntries<RectangleEntrySkeleton>({
    content_type: 'rectangle',
    limit: 1000,
    'fields.coords[exists]': true,
  });

  return entryCollectionToPaginatedResult(collection, entryToRectangle);
}
