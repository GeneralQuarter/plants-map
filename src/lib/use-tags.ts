import type { ContentfulClientApi } from 'contentful';
import { useEffect, useState } from 'react';
import { MARKED_TAG_ID } from '../data/keys';
import type { Tags } from '../models/tags';
import { getTags } from './contentful/get-tags';

export function useTags(cdaClient: ContentfulClientApi<undefined>): Tags {
  const [tags, setTags] = useState<Tags>({});

  useEffect(() => {
    (async () => {
      const tags = await getTags(cdaClient);
      tags[MARKED_TAG_ID] = 'Marqué';
      setTags(tags);
    })();
  }, [cdaClient]);

  return tags;
}
