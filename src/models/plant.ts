export interface Plant {
  id: string;
  plantCardId: string;
  code: string;
  fullLatinName: string;
  commonName: string;
  width: number;
  height: number;
  position?: [lat: number, lon: number];
  sourceLinks: string[];
  tags: string[];
}