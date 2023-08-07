import type { ContentfulClientApi } from 'contentful';
import type { Tags } from '../../models/tags';

export async function getTags(cdaClient: ContentfulClientApi<undefined>) {
  const tagCollection = await cdaClient.getTags({
    limit: 1000
  });

  return tagCollection.items.reduce((acc, tagEntry) => {
    acc[tagEntry.sys.id] = tagEntry.name;
    return acc;
  }, {} as Tags);
}
