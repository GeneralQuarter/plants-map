import { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToPlant } from './entry-to-plant';
import { PlantFields } from './plant-entry';

export async function getPlantsWithPosition(client: ContentfulClientApi) {
  const collection = await client.withoutUnresolvableLinks.getEntries<PlantFields>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true
  });

  return entryCollectionToPaginatedResult(collection, entryToPlant);
}