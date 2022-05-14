import { Hedge } from '../../models/hedge';
import { HedgeEntry } from './hedge-entry';

export function entryToHedge(entry: HedgeEntry): Hedge {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    coords: entry.fields.plants?.map(e => {
      return e.fields.position ? [
        e.fields.position.lat,
        e.fields.position.lon
      ] : undefined
    }).filter(n => !!n) as [number, number][] ?? []
  }
}