export interface MeasurementNode {
  id: string;
  position: [lat: number, lon: number];
}

export interface MeasurementGraph {
  nodes: { [id: string]: MeasurementNode };
  edges: [aId: string, bId: string][];
}
