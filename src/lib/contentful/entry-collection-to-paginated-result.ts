import type {
  ChainModifiers,
  Entry,
  EntryCollection,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful';
import type { PaginatedResult } from '../../models/paginated-result';

export function entryCollectionToPaginatedResult<
  T,
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  collection: EntryCollection<EntrySkeleton, Modifiers, Locales>,
  entryToItem: (e: Entry<EntrySkeleton, Modifiers, Locales>) => T,
): PaginatedResult<T> {
  return {
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
    items: collection.items.map((e) => entryToItem(e)),
  };
}
