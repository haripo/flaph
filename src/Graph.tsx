import React from 'react';
import RectangleTextNode from './elements/RectangleTextNode';
import { RenderedNode } from './Main';

type Props = {
  graph: { nodes: RenderedNode[], edges: any[] },
  onNodeChange: ({ id, key, body }) => void
}

export default function Graph(props: Props) {
  return (
    <svg width='100%' height='100%'>
      {
        props.graph.nodes.map(node => (
          <RectangleTextNode
            key={node.id}
            node={node}
            onChange={ props.onNodeChange }
          />
        ))
      }
      {
        props.graph.edges.map(edge => {
          let a = [];
          const points = edge.points;
          for (let i = 0; i < points.length - 1; i++) {
            a.push(
              <line
                key={edge.from + edge.to + i}
                x1={points[i].x}
                y1={points[i].y}
                x2={points[i + 1].x}
                y2={points[i + 1].y}
                stroke={'red'}
                strokeWidth={1}
              />
            );
          }
          return a;
        })
      }
    </svg>
  )
}
