import { ContentfulClientApi } from 'contentful';
import { Tags } from '../../models/tags';

export async function getTags(cdaClient: ContentfulClientApi) {
  const tagCollection = await cdaClient.getTags({
    limit: 1000
  });

  return tagCollection.items.reduce((acc, tagEntry) => {
    acc[tagEntry.sys.id] = tagEntry.name;
    return acc;
  }, {} as Tags);
}