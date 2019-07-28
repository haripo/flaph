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
  dagre.layout(graph);

  return graph.nodes()
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
}

export default function Main() {
  const [strNodes, setNodes] = useState(JSON.stringify(originalNodes));
  const nodes = JSON.parse(strNodes);

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
          renderGraph(nodes).map(node => (
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
      </svg>
    </div>
  )
}
