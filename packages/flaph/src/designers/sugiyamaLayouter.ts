export interface Node {
  id: string;
  layer?: number;
}

export interface Edge {
  from: string;
  to: string;
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

function incomingEdges(graph: Graph, targetNode: string) {
  return graph.edges.filter(e => e.to === targetNode);
}

function outgoingEdges(graph: Graph, targetNode: string) {
  return graph.edges.filter(e => e.from === targetNode);
}

export function removeCycles(graph: Graph) {
  const result: Graph = graph;
  const marked = new Set<string>();
  const stack = new Set<string>();

  function dfs(targetNode: string) {
    if (marked.has(targetNode)) {
      return;
    }
    marked.add(targetNode);
    stack.add(targetNode);

    for (const edge of outgoingEdges(graph, targetNode)) {
      if (stack.has(edge.to)) {
        graph.edges = graph.edges.filter(e => e !== edge);
      } else if (!marked.has(edge.to)) {
        dfs(edge.to);
      }
    }

    stack.delete(targetNode);
  }

  for (const node of graph.nodes) {
    dfs(node.id);
  }

  return result;
}

export function longestPathLayerAssignment(graph: Graph): Graph {
  // TODO: clone graph
  const nodesInPastLayer = new Set<string>();
  const nodesInCurrentLayer = new Set<string>();

  function isNodeIncomingOnlyFromPastLayer(nodeId: string) {
    for (let incomingEdge of incomingEdges(graph, nodeId)) {
      if (!nodesInPastLayer.has(incomingEdge.from)) {
        return false;
      }
    }
    return true;
  }

  // find node which is not assigned to layer, and incoming only from past layer
  function findNextNode() {
    for (const node of graph.nodes) {
      if (node.layer === undefined && isNodeIncomingOnlyFromPastLayer(node.id)) {
        return node;
      }
    }
    return null;
  }

  let layer = 0;
  while (nodesInPastLayer.size < graph.nodes.length) {
    const v = findNextNode();
    if (v) {
      v.layer = layer;
      nodesInCurrentLayer.add(v.id);
    } else {
      layer += 1;
      nodesInCurrentLayer.forEach(v => nodesInPastLayer.add(v));
      nodesInCurrentLayer.clear();
    }
  }
}