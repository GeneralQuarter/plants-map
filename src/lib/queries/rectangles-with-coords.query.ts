import { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Rectangle } from '../../models/rectangle';
import { getRectanglesWithCoords } from '../contentful/get-rectangles-with-coords';

export const rectanglesWithCoordsQueryKey = 'rectangles-with-coords';

export function useRectanglesWithCoordsQuery(cdaClient: ContentfulClientApi<undefined>) {
  const fetchRectanglesWithCoords = useCallback(async () => {
    const res = await getRectanglesWithCoords(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<Rectangle[]>(rectanglesWithCoordsQueryKey, fetchRectanglesWithCoords, {refetchOnWindowFocus: false});
}
