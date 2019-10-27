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
  constraints: LayerConstraint;
  virtualEdges?: Edge[];
  numLayer?: number;
}

export interface LayerConstraint {
  alignHorizontal: { [baseNode: string]: string[] };
  alignVertical: { [baseNode: string]: string[] };
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
        graph.virtualEdges.push(edge);
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
  let nextQueue = [];

  function findNextNode() {
    if (nextQueue.length > 0) {
      const id = nextQueue.pop();
      return graph.nodes.find(n => n.id === id);
    }
    for (const node of graph.nodes) {
      if (node.layer !== undefined) {
        continue;
      }

      if (isNodeIncomingOnlyFromPastLayer(node.id)) {
        if (graph.constraints.alignHorizontal[node.id] !== undefined) {
          nextQueue.push(...graph.constraints.alignHorizontal[node.id]);
        }
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
  function moveNode(node: Node, order: number, layer: number) {
    node.order = -1;
    while (graph.nodes.find(n => (n.order === order && n.layer === layer))) {
      order++;
    }
    node.order = order;
  }

  function moveNodeForce(node: Node, order: number, layer: number) {
    while (true) {
      const conflict = graph.nodes.find(n => (n.order === order && n.layer === layer));
      if (conflict === undefined) {
        break;
      }
      moveNodeForce(conflict, conflict.order + 1, conflict.layer);
    }
    node.order = order;
  }

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
          moveNode(node, med, i);
        }
      }
    }

    // force constraint
    for (const node of graph.nodes) {
      if (graph.constraints.alignVertical[node.id]) {
        for (const otherNodeId of graph.constraints.alignVertical[node.id]) {
          const otherNode = graph.nodes.find(n => n.id === otherNodeId);
          if (otherNode !== undefined) {
            moveNodeForce(otherNode, node.order, otherNode.layer);
          }
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
          moveNode(node, med, i);
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
  revMedian();
  median();
  revMedian();
  median();

  return graph;
}

export function layoutGraph(graphModel: GraphModel): Layout {
  let graph: Graph = {
    nodes: [],
    edges: [],
    virtualEdges: [],
    constraints: {
      alignHorizontal: {},
      alignVertical: {}
    }
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
    if (element.type === 'constraint') {
      const first = element.properties.nodes[0];
      const rest = element.properties.nodes.slice(1);
      if (element.properties.axis === 'horizontal') {
        graph.constraints.alignHorizontal[first] = rest;
      }
      if (element.properties.axis === 'vertical') {
        graph.constraints.alignVertical[first] = rest;
      }
    }
  }

  graph = removeCycles(graph);
  graph = longestPathLayerAssignment(graph);
  graph = orderNodes(graph);

  if (graph.virtualEdges) {
    graph.edges.push(...graph.virtualEdges);
  }

  const defaultHeight = 50;
  const defaultWidth = 50;
  const nodeMargin = 50;

  const findNode = (nodeId: string) => graphModel[nodeId] as NodeGraphElement;
  const nodeYCenters = [];
  for (let i = 0; i < graph.numLayer; i++) {
    const maxHeight = graph.nodes
      .filter(node => node.layer === i)
      .map(node => node.id)
      .map(findNode)
      .map(n => n.properties.height || defaultHeight)
      .reduce((a, b) => a > b ? a : b, 0);
    nodeYCenters.push(maxHeight || 0);
  }

  const nodeXCenters = [];
  for (let i = 0; i < graph.nodes.map(n => n.order).reduce((a, b) => a > b ? a : b); i++) {
    const maxWidth = graph.nodes
      .filter(node => node.order === i)
      .map(node => node.id)
      .map(findNode)
      .map(n => n.properties.width || defaultWidth)
      .reduce((a, b) => a > b ? a : b, 0);
    nodeXCenters.push(maxWidth || 0);
  }

  const nodes: NodeLayoutElement[] = graph.nodes
    .map((v) => {
      const model = graphModel[v.id] as NodeGraphElement;
      return {
        id: model.id,
        model,
        type: 'node',
        location: {
          width: model.properties.width || defaultWidth,
          height: model.properties.height || defaultHeight,
          x: nodeXCenters.slice(0, v.order).reduce((a, b) => a + b + nodeMargin, nodeMargin),
          y: nodeYCenters.slice(0, v.layer).reduce((a, b) => a + b + nodeMargin, nodeMargin)
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
          center(nodes.find(n => n.id === model.properties.to).location),
          center(nodes.find(n => n.id === model.properties.from).location)
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
    a.x -= dx || 0;
    a.y -= dy || 0;
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

