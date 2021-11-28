import { PaginatedResult } from '../../models/paginated-result';
import { Entry, EntryCollection } from 'contentful';

export function entryCollectionToPaginatedResult<TF, TR>(collection: EntryCollection<TF>, entryToItem: (e: Entry<TF>) => TR): PaginatedResult<TR> {
  return {
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
    items: collection.items.map(e => entryToItem(e))
  }
}