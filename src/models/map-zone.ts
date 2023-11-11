export interface MapZone {
  id: string;
  name: string;
  orientation: 'landscape' | 'portrait';
  coords?: [lat: number, lon: number][];
}
