import {
  BoxLocation,
  EdgeGraphElement,
  EdgeLayoutElement,
  GraphModel,
  Layout,
  NodeGraphElement,
  NodeLayoutElement
} from '../types';

export interface Node {
  id: string;
  layer?: number;
  order?: number;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  numLayer?: number;
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

  graph.numLayer = layer;
  return graph;
}

export function orderNodes(graph: Graph): Graph {
  function median() {
    for (let i = 1; i < graph.numLayer; i++) {
      for (const node of graph.nodes.filter((n) => n.layer === i)) {
        const prevNodes = new Set(graph.nodes
          .filter((n) => n.layer === i - 1)
          .map((n) => n.id));
        const linkedPrevNodes = graph.edges
          .filter((e) => prevNodes.has(e.from) && e.to === node.id)
          .map((e) => e.from);
        const prevOrders = linkedPrevNodes
          .map((n) => graph.nodes.find((nn) => nn.id === n).order);
        let med = prevOrders[Math.floor(prevOrders.length / 2)];

        if (med !== undefined) {
          node.order = -1;
          while (graph.nodes.find(n => (n.order === med && n.layer === i))) {
            med++;
          }
          node.order = med;
        }
      }
    }
  }

  function revMedian() {
    for (let i = graph.numLayer - 2; i >= 0; i--) {
      for (const node of graph.nodes.filter((n) => n.layer === i)) {
        const prevNodes = new Set(graph.nodes
          .filter((n) => n.layer === i + 1)
          .map((n) => n.id));
        const linkedPrevNodes = graph.edges
          .filter((e) => prevNodes.has(e.to) && e.from === node.id)
          .map((e) => e.to);
        const prevOrders = linkedPrevNodes
          .map((n) => graph.nodes.find((nn) => nn.id === n).order);
        let med = prevOrders[Math.floor(prevOrders.length / 2)];

        if (med !== undefined) {
          node.order = -1;
          while (graph.nodes.find(n => (n.order === med && n.layer === i))) {
            med++;
          }
          node.order = med;
        }
      }
    }
  }

  let tmp = {};
  for (const node of graph.nodes) {
    if (tmp[node.layer] === undefined) {
      tmp[node.layer] = 0;
    }
    node.order = tmp[node.layer];
    tmp[node.layer]++;
  }

  median();
  revMedian();
  median();

  return graph;
}

export function layoutGraph(graphModel: GraphModel): Layout {
  let graph: Graph = {
    nodes: [],
    edges: []
  };

  for (const element of Object.values(graphModel)) {
    if (element.type === 'node') {
      graph.nodes.push({ id: element.id });
    }
    if (element.type === 'edge') {
      graph.edges.push({
        id: element.id,
        from: element.properties.from,
        to: element.properties.to
      });
    }
  }

  graph = removeCycles(graph);
  graph = longestPathLayerAssignment(graph);
  graph = orderNodes(graph);

  const nodes: NodeLayoutElement[] = graph.nodes
    .map((v) => {
      const model = graphModel[v.id] as NodeGraphElement;
      return {
        id: model.id,
        model,
        type: 'node',
        location: {
          width: 100,
          height: 100,
          x: v.order * (100 + 10) + 10,
          y: v.layer * (100 + 10) + 10
        }
      };
    });

  const edges: EdgeLayoutElement[] = graph.edges
    .map((e) => {
      const model = graphModel[e.id] as EdgeGraphElement;
      return {
        id: model.id,
        model,
        type: 'edge',
        location: clipEdgeByRect([
          center(nodes.find(n => n.id === model.properties.from).location),
          center(nodes.find(n => n.id === model.properties.to).location)
        ])
      };
    });

  const result = {};
  for (const element of [...nodes, ...edges]) {
    result[element.id] = element;
  }
  return result;
}

// helper functions

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

function clipEdgeByRect([x, y]: BoxLocation[]) {
  function clip([a, b]: BoxLocation[]) {
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

  return clip(clip([x, y]).reverse());
}

function center(location: BoxLocation) {
  return {
    x: location.x + location.width / 2,
    y: location.y + location.height / 2,
    width: location.width,
    height: location.height
  }
}

