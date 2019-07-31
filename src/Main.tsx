import React, { useState } from 'react';
import Graph from './Graph';
import dagre from 'dagre';
import { parse } from './parser';

export type Node = {
  id: string,
  param: {
    body?: { value: string, start: number, end: number },
    to?: string,
    width?: string,
    height?: string
  }
}

export type RenderedNode = {
  id: string,
  contents: {
    body: string
  },
  layout: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}

// dag
const originalNodes = `
1: {
  body: jjjjj
  to: 2
}
2: {
  body: iiii
}
`;

function renderGraph(dag: Node[]) {
  let graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(((v, w) => {
    return {}
  }));
  // graph.setDefaultNodeLabel((v) => { return {} });

  console.log(dag);

  for (let node of dag) {
    graph.setNode(node.id, {
      id: node.id,
      label: node.param.body.value,
      width: parseInt(node.param.width || '100'),
      height: parseInt(node.param.height || '100'),
    });
  }

  graph.setEdge('1', '2');
  // graph.setEdge('3', '2');
  // graph.setEdge('2', '4');
  // graph.setEdge('4', '5');
  dagre.layout(graph);

  const nodes: RenderedNode[] = graph.nodes()
    .map(v => graph.node(v))
    .map(v => {
      const node = dag.find(node => node.id === v.id);
      return {
        id: node.id,
        contents: {
          body: node.param.body.value
        },
        layout: {
          width: v.width,
          height: v.height,
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

function revParse(body: any) {
  return JSON.stringify(body, null, 2)
}

export default function Main() {
  const [strNodes, setNodes] = useState(originalNodes);
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
          onNodeChange={ ({ id, key, body }) => {
            const node = nodes.find(n => n.id === id);
            if (key === 'body') {
              console.log(body);
              const newNodes = strNodes.slice(0, node.param.body.start) + body + strNodes.slice(node.param.body.end)
              setNodes(newNodes);
            }
          }}
        />
      ) : (
        <div>parse error</div>
      )}
    </div>
  )
}
