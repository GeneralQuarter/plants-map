import { ContentfulClientApi } from 'contentful';

export async function queryEntries(client: ContentfulClientApi, query: string) {
  return client.withoutUnresolvableLinks.getEntries({
    query,
    limit: 40,
  });
}