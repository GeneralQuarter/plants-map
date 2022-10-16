import { ContentfulClientApi } from 'contentful';
import { useEffect, useState } from 'react';
import { MARKED_TAG_ID } from '../data/keys';
import { Tags } from '../models/tags';
import { getTags } from './contentful/get-tags';

export function useTags(cdaClient: ContentfulClientApi): Tags {
  const [tags, setTags] = useState<Tags>({});

  useEffect(() => {
    (async () => {
      const tags = await getTags(cdaClient);
      tags[MARKED_TAG_ID] = 'Marqué';
      setTags(tags);
    })()
  }, [cdaClient]);

  return tags;
}