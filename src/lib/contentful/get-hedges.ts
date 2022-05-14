import { ContentfulClientApi } from "contentful";
import { entryCollectionToPaginatedResult } from "./entry-collection-to-paginated-result";
import { entryToHedge } from "./entry-to-hedge";
import { HedgeFields } from "./hedge-entry";

export async function getHedges(client: ContentfulClientApi) {
  const collection = await client.withoutUnresolvableLinks.getEntries<HedgeFields>({
    content_type: 'hedge',
    limit: 1000
  });

  return entryCollectionToPaginatedResult(collection, entryToHedge);
}