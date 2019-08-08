import dagre from 'dagre';
import { GraphModel, Layout, LayoutElement } from '../types';

export function layout(graphModel: GraphModel): Layout {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(((v, w) => {
    return {}
  }));

  // TODO: ensure element.properties.{body, width, height} are presents

  for (let element of graphModel) {
    graph.setNode(element.id, {
      id: element.id,
      label: element.properties.body,
      width: parseInt(element.properties.width || '100'),
      height: parseInt(element.properties.height || '100'),
    });

    if (element.properties.to) {
      graph.setEdge(element.id, element.properties.to);
    }
  }

  dagre.layout(graph);

  const nodes: LayoutElement[] = graph.nodes()
    .map(v => graph.node(v))
    .map(v => {
      const model = graphModel.find(node => node.id === v.id);
      return {
        id: model.id,
        model: model,
        type: 'box',
        location: {
          width: v.width,
          height: v.height,
          x: v.x,
          y: v.y
        }
      };
    });

  const edges: LayoutElement[] = graph.edges()
    .map(e => {
      return {
        id: `@edge-${e.v}-${e.w}`,
        model: {
          id: null,
          type: 'edge',
          properties: {
            from: e.v,
            to: e.w
          }
        },
        type: 'path',
        location: graph.edge(e).points
      };
    });

  let result = {};
  for (let element of [...nodes, ...edges]) {
    result[element.id] = element;
  }
  return result;
}
