import { LatLngAlt } from '../../models/leaflet/lat-lng-alt';
import { LatLng } from 'leaflet';

export function latLngAtlToLatLng(latlngAlt: LatLngAlt): LatLng {
  return new LatLng(latlngAlt[1], latlngAlt[0], latlngAlt[2]);
}