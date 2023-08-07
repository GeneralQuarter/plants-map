import { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToPlant } from './entry-to-plant';
import { PlantEntrySkeleton } from './plant.entry-skeleton';

export async function getPlantsWithPosition(client: ContentfulClientApi<undefined>) {
  const collection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton, 'fr'>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true
  });

  return entryCollectionToPaginatedResult(collection, entryToPlant);
}
