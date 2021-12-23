import { ContentfulClientApi } from 'contentful';
import { useEffect, useState } from 'react';
import { Tags } from '../models/tags';
import { getTags } from './contentful/get-tags';

export function useTags(cdaClient: ContentfulClientApi): Tags {
  const [tags, setTags] = useState<Tags>({});

  useEffect(() => {
    (async () => {
      setTags(await getTags(cdaClient));
    })()
  }, [cdaClient]);

  return tags;
}