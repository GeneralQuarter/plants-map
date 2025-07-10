import { useQuery } from '@tanstack/react-query';
import type { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import type { Rectangle } from '../../models/rectangle';
import { getRectanglesWithCoords } from '../contentful/get-rectangles-with-coords';

export const rectanglesWithCoordsQueryKey = 'rectangles-with-coords';

export function useRectanglesWithCoordsQuery(
  cdaClient: ContentfulClientApi<undefined>,
) {
  const fetchRectanglesWithCoords = useCallback(async () => {
    const res = await getRectanglesWithCoords(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<Rectangle[]>({
    queryKey: [rectanglesWithCoordsQueryKey],
    queryFn: fetchRectanglesWithCoords,
    refetchOnWindowFocus: false,
  });
}
