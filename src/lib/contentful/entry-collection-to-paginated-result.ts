import { PaginatedResult } from '../../models/paginated-result';
import { EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks, EntryWithLinkResolutionAndWithoutUnresolvableLinks } from 'contentful';
import { FieldsType } from 'contentful/dist/types/types/query/util';

export function entryCollectionToPaginatedResult<TF extends FieldsType, TR>(collection: EntryCollectionWithLinkResolutionAndWithoutUnresolvableLinks<TF>, entryToItem: (e: EntryWithLinkResolutionAndWithoutUnresolvableLinks<TF>) => TR): PaginatedResult<TR> {
  return {
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
    items: collection.items.map(e => entryToItem(e))
  }
}