import type { ContentfulClientApi } from 'contentful';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToHedge } from './entry-to-hedge';
import type { HedgeEntrySkeleton } from './hedge.entry-skeleton';

export async function getHedges(client: ContentfulClientApi<undefined>) {
  const collection =
    await client.withoutUnresolvableLinks.getEntries<HedgeEntrySkeleton>({
      content_type: 'hedge',
      limit: 1000,
    });

  return entryCollectionToPaginatedResult(collection, entryToHedge);
}
