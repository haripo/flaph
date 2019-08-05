import * as Cola from 'webcola';
import { GraphModel, Layout } from '../types';

type Rect = { x: number, y: number, width: number, height: number };

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

export function layout(graphModel: GraphModel): Layout {
  const layout = new Cola.Layout();
  const nodePadding = 20;

  const elementIdToIndex = {};
  for (let [i, element] of graphModel.entries()) {
    elementIdToIndex[element.id] = i;
  }

  layout.nodes(
    graphModel.map(e => ({
      id: e.id,
      name: e.id,
      width: parseInt(e.properties.width || '100') + nodePadding * 2,
      height: parseInt(e.properties.height || '100') + nodePadding * 2,
    }))
  );

  layout.links(
    graphModel
      .filter(e => e.properties.to)
      .map(e => ({
        source: elementIdToIndex[e.id],
        target: elementIdToIndex[e.properties.to]
      }))
  );

  layout.avoidOverlaps(true);
  layout.linkDistance(120);
  layout.handleDisconnected(false);
  layout.start(50, 50, 50, 50);

  const pageX = -Math.min(...layout.nodes().map(n => n.x - n.width / 2));
  const pageY = -Math.min(...layout.nodes().map(n => n.y - n.height / 2));

  const nodes: Layout = layout.nodes()
    .map(node => {
      const model = graphModel.find(n => n.id === node['id']);
      return {
        id: model.id,
        model: model,
        type: 'box',
        location: {
          width: node.width - nodePadding * 2,
          height: node.height - nodePadding * 2,
          x: node.x + nodePadding + pageX,
          y: node.y + nodePadding + pageY
        }
      };
    });

  const edges: Layout = layout.links()
    .map(link => {
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
      }

      // clipEdgeByRect は辺の片方を clip するので，reverse して 2 回実行する
      let rectPair = clipEdgeByRect(clipEdgeByRect([{
        x: source.x + nodePadding + pageX,
        y: source.y + nodePadding + pageY,
        width: source.width - nodePadding * 2,
        height: source.height - nodePadding * 2
      }, {
        x: target.x + nodePadding + pageX,
        y: target.y + nodePadding + pageY,
        width: target.width - nodePadding * 2,
        height: target.height - nodePadding * 2
      }]).reverse())

      return {
        id: null,
        model: {
          id: null,
          type: 'edge',
          properties: {
          }
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

  return [...nodes, ...edges];
}