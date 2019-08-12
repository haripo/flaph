import * as Cola from 'webcola';
import { GraphModel, Layout, LayoutElement } from '../types';

type Rect = { x: number, y: number, width: number, height: number };

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

export function layout(graphModel: GraphModel): Layout {
  const cola = new Cola.Layout();
  const nodePadding = 20;

  const elementIdToIndex = {};
  for (const [i, element] of Object.values(graphModel.elements).entries()) {
    elementIdToIndex[element.id] = i;
  }

  cola.nodes(Object.values(graphModel.elements).map((e) => {
    const hasPosition = e.properties.x !== undefined && e.properties.y !== undefined;
    return {
      id: e.id,
      name: e.id,
      x: hasPosition ? parseInt(e.properties.x, 10) : undefined,
      y: hasPosition ? parseInt(e.properties.y, 10) : undefined,
      fixed: hasPosition ? 2 : 0,
      width: parseInt(e.properties.width || '100', 10) + nodePadding * 2,
      height: parseInt(e.properties.height || '100', 10) + nodePadding * 2
    };
  }));

  cola.links(
    Object.values(graphModel.elements)
      .filter((e) => e.properties.to)
      .map((e) => ({
        source: elementIdToIndex[e.id],
        target: elementIdToIndex[e.properties.to]
      }))
  );

  cola.constraints(
    Object.values(graphModel.constraints)
      .map((e) => {
        const nodeIds = e.properties.nodes.split(',');
        if (!nodeIds.every((id) => id in graphModel.elements)) {
          console.warn(`undefined node id: ${nodeIds}`);
          return null;
        }
        return {
          type: 'alignment',
          axis: e.id.includes('horizontal') ? 'y' : 'x',
          offsets: nodeIds.map((node) => ({ node: elementIdToIndex[node], offset: 0 }))
        };
      })
      .filter((v) => v !== null)
  );

  cola.avoidOverlaps(true);
  cola.linkDistance(120);
  cola.start(50, 50, 50);

  const pageX = -Math.min(...cola.nodes().map((n) => n.x));
  const pageY = -Math.min(...cola.nodes().map((n) => n.y));

  const nodes: LayoutElement[] = cola.nodes()
    .map((node) => {
      const model = graphModel.elements[node.id];
      return {
        id: model.id,
        model,
        type: 'box',
        location: {
          width: node.width - nodePadding * 2,
          height: node.height - nodePadding * 2,
          x: node.x + nodePadding + pageX,
          y: node.y + nodePadding + pageY
        }
      };
    });

  const edges: LayoutElement[] = cola.links()
    .map((link) => {
      const source = link.source as Cola.Node;
      const target = link.target as Cola.Node;

      const clipEdgeByRect = ([a, b]: Rect[]) => {
        const dx = clamp(
          (a.x - b.x) * a.height / (2 * Math.abs(b.y - a.y)),
          -a.width / 2,
          a.width / 2);
        const dy = clamp(
          (a.y - b.y) * a.width / (2 * Math.abs(b.x - a.x)),
          -a.height / 2,
          a.height / 2);
        a.x -= dx;
        a.y -= dy;
        return [a, b];
      };

      // clipEdgeByRect は辺の片方を clip するので，reverse して 2 回実行する
      const rectPair = clipEdgeByRect(clipEdgeByRect([{
        x: source.x + pageX + source.width / 2,
        y: source.y + pageY + source.height / 2,
        width: source.width - nodePadding * 2,
        height: source.height - nodePadding * 2
      }, {
        x: target.x + pageX + target.width / 2,
        y: target.y + pageY + target.height / 2,
        width: target.width - nodePadding * 2,
        height: target.height - nodePadding * 2
      }]).reverse());

      return {
        id: `@edge-${source.id}-${target.id}`,
        model: {
          id: null,
          type: 'edge',
          properties: {}
        },
        type: 'path',
        location: [
          {
            x: rectPair[0].x,
            y: rectPair[0].y
          },
          {
            x: rectPair[1].x,
            y: rectPair[1].y
          }
        ]
      };
    });

  const result = {};
  for (const element of [...nodes, ...edges]) {
    result[element.id] = element;
  }
  return result;
}
