import type { ContentfulClientApi } from 'contentful';

export async function queryEntries(
  client: ContentfulClientApi<undefined>,
  query: string,
) {
  return client.withoutUnresolvableLinks.getEntries({
    query,
    limit: 40,
  });
}
