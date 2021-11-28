export interface Rectangle {
  id: string;
  label: string;
  width: number;
  length: number;
  coords?: [lat: number, lon: number][];
}