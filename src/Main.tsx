import React, { useState } from 'react';
import Graph from './Graph';
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

function parse(text: string) {
  try {
    return {
      succeeded: true,
      result: JSON.parse(text)
    };
  } catch (e) {
    return {
      succeeded: false,
      result: ''
    };
  }
}

function revParse(body: any) {
  return JSON.stringify(body, null, 2)
}

export default function Main() {
  const [strNodes, setNodes] = useState(JSON.stringify(originalNodes, null, 2));
  const { result: nodes, succeeded } = parse(strNodes);
  const rendered = succeeded ? renderGraph(nodes) : { nodes: [], edges: [] };

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
          width: 600,
          height: '100%'
        } }
      />
      {
        succeeded ? (
        <Graph
          graph={ rendered }
          onNodeChange={ node => {
            const i = nodes.findIndex(n => n.id === node.id);
            const newNodes = Object.assign([], nodes, { [i]: node });
            setNodes(revParse(newNodes));
          }}
        />
      ) : (
        <div>parse error</div>
      )}
    </div>
  )
}
