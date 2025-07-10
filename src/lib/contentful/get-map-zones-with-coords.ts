import type { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToMapZone } from './entry-to-map-zone';
import type { MapZoneEntrySkeleton } from './map-zone.entry-skeleton';

export async function getMapZonesWithCoords(
  cdaClient: ContentfulClientApi<undefined>,
) {
  const collection =
    await cdaClient.withoutUnresolvableLinks.getEntries<MapZoneEntrySkeleton>({
      content_type: 'mapZone',
      limit: 1000,
      'fields.coords[exists]': true,
    });

  return entryCollectionToPaginatedResult(collection, entryToMapZone);
}
