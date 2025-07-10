import type { Hedge } from '../../models/hedge';
import type { HedgeEntry } from './hedge.entry-skeleton';

export function entryToHedge(entry: HedgeEntry): Hedge {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    coords: entry.fields.coords,
  };
}
