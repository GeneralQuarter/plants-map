import { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToRectangle } from './entry-to-rectangle';
import { RectangleFields } from './rectangle-entry';

export async function getRectanglesWithCoords(cdaClient: ContentfulClientApi) {
  const collection = await cdaClient.withoutUnresolvableLinks.getEntries<RectangleFields>({
    content_type: 'rectangle',
    limit: 1000,
    'fields.coords[exists]': true,
  });

  return entryCollectionToPaginatedResult(collection, entryToRectangle);
}