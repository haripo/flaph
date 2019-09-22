import dagre from 'dagre';
import {
  EdgeGraphElement,
  EdgeLayoutElement,
  GraphModel,
  Layout,
  NodeGraphElement,
  NodeLayoutElement
} from '../types';

export function layoutGraph(graphModel: GraphModel): Layout {
  try {
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({});
    graph.setDefaultEdgeLabel(((v, w) => {
      return {};
    }));

    for (const element of Object.values(graphModel)) {
      if (element.type === 'node') {
        graph.setNode(element.id, {
          id: element.id,
          label: element.properties.body,
          width: element.properties.width || 100,
          height: element.properties.height || 100
        });
      }

      if (element.type === 'edge') {
        graph.setEdge(
          element.properties.from,
          element.properties.to,
          {
            id: element.id
          });
      }
    }

    dagre.layout(graph);

    const nodes: NodeLayoutElement[] = graph.nodes()
      .map((v) => graph.node(v))
      .map((v) => {
        const model = graphModel[v.id] as NodeGraphElement;
        return {
          id: model.id,
          model,
          type: 'node',
          location: {
            width: v.width,
            height: v.height,
            x: v.x - v.width / 2,
            y: v.y - v.height / 2
          }
        };
      });

    const edges: EdgeLayoutElement[] = graph.edges()
      .map((e) => graph.edge(e))
      .map((e) => {
        const model = graphModel[e.id] as EdgeGraphElement;
        return {
          id: model.id,
          model,
          type: 'edge',
          location: e.points
        };
      });

    const result = {};
    for (const element of [...nodes, ...edges]) {
      result[element.id] = element;
    }
    return result;
  } catch (e) {
    console.warn(e);
    return null;
  }
}
