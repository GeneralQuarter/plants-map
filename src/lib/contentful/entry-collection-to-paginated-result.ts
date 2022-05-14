import { PaginatedResult } from '../../models/paginated-result';
import { EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks, EntryWithLinkResolutionAndWithoutUnresolvableLinks } from 'contentful';

export function entryCollectionToPaginatedResult<TF, TR>(collection: EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<TF>, entryToItem: (e: EntryWithLinkResolutionAndWithoutUnresolvableLinks<TF>) => TR): PaginatedResult<TR> {
  return {
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
    items: collection.items.map(e => entryToItem(e))
  }
}