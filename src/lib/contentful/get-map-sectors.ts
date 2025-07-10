import type { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToMapSector } from './entry-to-map-sector';
import type { MapSectorEntrySkeleton } from './map-sector.entry-skeleton';

export async function getMapSectors(client: ContentfulClientApi<undefined>) {
  const collection =
    await client.withoutUnresolvableLinks.getEntries<MapSectorEntrySkeleton>({
      content_type: 'mapSector',
      limit: 1000,
    });

  return entryCollectionToPaginatedResult(collection, entryToMapSector);
}
