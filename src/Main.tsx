import React, { useState } from 'react';
import RectangleTextNode from './elements/RectangleTextNode';
import dagre from 'dagre';

export type Node = {
  id: string,
  contents: any,
  layout: {
    x?: number,
    y?: number,
    width: number,
    height: number
  }
}

// dag
const originalNodes: Node[] = [
  {
    id: '1',
    contents: {
      title: 'hotg',
      body: 'fuga'
    },
    layout: {
      width: 100,
      height: 100,
    }
  },
  {
    id: '2',
    contents: {
      title: 'hotg',
      body: 'fuga'
    },
    layout: {
      width: 200,
      height: 100,
    }
  },
  {
    id: '3',
    contents: {
      title: 'hotg',
      body: 'fuga'
    },
    layout: {
      width: 100,
      height: 200,
    }
  },
  {
    id: '4',
    contents: {
      title: 'hotg',
      body: 'fuga'
    },
    layout: {
      width: 100,
      height: 200,
    }
  },
  {
    id: '5',
    contents: {
      title: 'hotg',
      body: 'fuga'
    },
    layout: {
      width: 100,
      height: 200,
    }
  }
];

function renderGraph(dag: Node[]) {
  let graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(((v, w) => {
    return {}
  }));
  // graph.setDefaultNodeLabel((v) => { return {} });

  for (let node of dag) {
    graph.setNode(node.id, {
      label: node.contents.title,
      width: node.layout.width,
      height: node.layout.height,
      id: node.id,
    });
  }

  graph.setEdge('1', '2');
  graph.setEdge('3', '2');
  graph.setEdge('2', '4');
  graph.setEdge('4', '5');
  dagre.layout(graph);

  const nodes = graph.nodes()
    .map(v => graph.node(v))
    .map(v => {
      const node = dag.find(node => node.id === v.id);
      return {
        ...node,
        layout: {
          ...node.layout,
          x: v.x,
          y: v.y
        }
      };
    });
  const edges = graph.edges()
    .map(e => {
      return {
        from: e.v,
        to: e.w,
        points: graph.edge(e).points
      }
    });
  return { nodes, edges }
}

export default function Main() {
  const [strNodes, setNodes] = useState(JSON.stringify(originalNodes));
  const nodes = JSON.parse(strNodes);
  const rendered = renderGraph(nodes);

  return (
    <div style={ {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%'
    } }>
      <textarea
        value={ strNodes }
        onChange={ e => setNodes(e.target.value) }
        style={ {
          width: 200,
          height: 600
        } }
      />
      <svg width='100%' height='100%'>
        {
          rendered.nodes.map(node => (
            <RectangleTextNode
              key={ node.id }
              node={ node }
              onChange={ node => {
                const i = nodes.findIndex(n => n.id === node.id);
                const newNodes = Object.assign([], nodes, { [i]: node });
                setNodes(JSON.stringify(newNodes));
              } }
            />
          ))
        }
        {
          rendered.edges.map(edge => {
            let a = [];
            const points = edge.points;
            for (let i = 0; i < points.length - 1; i++) {
              a.push(
                <line
                  key={ edge.from + edge.to + i }
                  x1={ points[i].x }
                  y1={ points[i].y }
                  x2={ points[i + 1].x }
                  y2={ points[i + 1].y }
                  stroke={ 'red' }
                  strokeWidth={ 1 }
                />
              );
            }
            return a;
          })
        }
      </svg>
    </div>
  )
}
