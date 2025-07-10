import { LatLng } from 'leaflet';
import type { LatLngAlt } from '../../models/leaflet/lat-lng-alt';

export function latLngAtlToLatLng(latLngAlt: LatLngAlt): LatLng {
  return new LatLng(latLngAlt[1], latLngAlt[0], latLngAlt[2]);
}
