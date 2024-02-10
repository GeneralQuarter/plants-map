export interface Plant {
  id: string;
  plantCardId: string;
  code: string;
  sponsor: string;
  fullLatinName: string;
  commonName: string;
  width: number;
  height: number;
  position?: [lat: number, lon: number];
  sourceLinks: string[];
  tags: string[];
  plantedAt?: Date;
  declaredDeadAt?: Date;
}
