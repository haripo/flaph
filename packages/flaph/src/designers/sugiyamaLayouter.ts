export interface Node {
  id: string;
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

    for (const edge of incomingEdges(graph, targetNode)) {
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