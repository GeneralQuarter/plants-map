import { ContentfulClientApi, EntriesQueries } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToPlant } from './entry-to-plant';
import { PlantEntrySkeleton } from './plant.entry-skeleton';

const chunkSize = 1000;

export async function getPlantsWithPosition(client: ContentfulClientApi<undefined>) {
  const baseQuery: EntriesQueries<PlantEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'> = {
    content_type: 'plant',
    limit: chunkSize,
    'fields.position[exists]': true
  };

  const collection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton, 'fr'>(baseQuery);

  const nbCalls = Math.ceil(collection.total / chunkSize) - 1;

  for (let i = 1; i <= nbCalls; i++) {
    const chunkCollection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton, 'fr'>({
      ...baseQuery,
      skip: i * chunkSize
    });

    collection.items = collection.items.concat(chunkCollection.items);
  }

  return entryCollectionToPaginatedResult(collection, entryToPlant);
}
