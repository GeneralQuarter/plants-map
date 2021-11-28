import { useState, useMemo } from 'react';
import { MeasurementGraph, MeasurementNode } from '../models/measurement-graph';
import { MeasurementLine } from '../models/measurement-line';

type UseMeasurementGraph = [
  lines: MeasurementLine[], 
  addMeasure: (a: MeasurementNode, b: MeasurementNode) => void, 
  removeMeasurement: (edge: [string, string]) => void, 
  clearMeasurements: () => void
];

const initialGraph: MeasurementGraph = {nodes: {}, edges: []};

export function useMeasurementGraph(): UseMeasurementGraph {
  const [graph, setGraph] = useState<MeasurementGraph>(initialGraph);

  const hasNode = (node: MeasurementNode) => {
    return !!graph.nodes[node.id];
  }

  const isSameEdge = (edgeA: [string, string], edgeB: [string, string]): boolean => {
    return (edgeA[0] === edgeB[0] && edgeA[1] === edgeB[1]) || (edgeA[1] === edgeB[0] && edgeA[0] === edgeB[1])
  }

  const hasEdge = (edgeA: [string, string]) => {
    return graph.edges.some(edgeB => isSameEdge(edgeA, edgeB));
  }

  const hasEdgeWith = (id: string) => {
    return graph.edges.some(([aId, bId]) => aId === id || bId === id);
  }

  const addMeasure = (a: MeasurementNode, b: MeasurementNode) => {
    if (a.id === b.id) {
      return;
    }

    const newGraph = {...graph};
    let modified = false;

    if (!hasNode(a)) {
      newGraph.nodes[a.id] = {...a};
      modified = true;
    }

    if (!hasNode(b)) {
      newGraph.nodes[b.id] = {...b};
      modified = true;
    }

    if (hasEdge([a.id, b.id])) {
      if (modified) {
        setGraph(newGraph);
      }
      return;
    }

    graph.edges.push([a.id, b.id]);
    setGraph(newGraph);
  }

  const removeMeasurement = (edge: [string, string]) => {
    if (!hasEdge(edge)) {
      return;
    }

    const newGraph = {...graph};
    const edgeIndex = graph.edges.findIndex(e => isSameEdge(edge, e));
    newGraph.edges.splice(edgeIndex, 1);

    if (!hasEdgeWith(edge[0])) {
      delete newGraph.nodes[edge[0]];
    }

    if (!hasEdgeWith(edge[1])) {
      delete newGraph.nodes[edge[1]];
    }

    setGraph(newGraph);
  }

  const clearMeasurements = () => {
    setGraph(initialGraph);
  }

  const measurementLines: MeasurementLine[] = useMemo(() => {
    return graph.edges.map(([aId, bId]) => ({
      id: `${aId}->${bId}`,
      start: graph.nodes[aId].position,
      end: graph.nodes[bId].position,
    }))
  }, [graph]);

  return [measurementLines, addMeasure, removeMeasurement, clearMeasurements];
}