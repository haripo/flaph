import { removeCycles, Graph, longestPathLayerAssignment, orderNodes } from '../src/designers/sugiyamaLayouter';

describe('removeCycles', () => {
  test('simple graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'a' }
      ]
    };
    const result = removeCycles(graph);
    expect(result.nodes).toBe(graph.nodes);
    expect(result.edges).toHaveLength(2);
  });

  test('complex graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
        { id: 'e' },
        { id: 'f' },
        { id: 'g' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },

        { from: 'f', to: 'e' },
        { from: 'e', to: 'f' },

        { from: 'd', to: 'd' },
        { from: 'd', to: 'b' },
      ]
    };
    const result = removeCycles(graph);
    expect(result.nodes).toBe(graph.nodes);
    expect(result.edges).toHaveLength(4);
  });
});


describe('longestPathLayerAssignment', () => {
  test('simple graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]
    };

    const result = longestPathLayerAssignment(graph);
    expect(result.nodes[0].layer).toBe(0);
    expect(result.nodes[1].layer).toBe(1);
    expect(result.nodes[2].layer).toBe(2);
  });

  test('complex graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
        { id: 'e' },
        { id: 'f' },
        { id: 'g' }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },
        { from: 'f', to: 'e' },
        { from: 'a', to: 'd' }
      ]
    };

    const result = longestPathLayerAssignment(graph);
    expect(result.nodes[0].layer).toBe(0);
    expect(result.nodes[1].layer).toBe(1);
    expect(result.nodes[2].layer).toBe(2);
    expect(result.nodes[3].layer).toBe(3);
    expect(result.nodes[4].layer).toBe(1);
    expect(result.nodes[5].layer).toBe(0);
    expect(result.nodes[6].layer).toBe(0);
  });
});


describe('orderNodes', () => {
  test('simple graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a', layer: 0 },
        { id: 'b', layer: 1 },
        { id: 'c', layer: 2 }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ],
      numLayer: 3
    };

    const result = orderNodes(graph);
    expect(result.nodes[0].order).toBe(0);
    expect(result.nodes[0].order).toBe(0);
    expect(result.nodes[0].order).toBe(0);
  });

  test('complex graph', () => {
    const graph: Graph = {
      nodes: [
        { id: 'a', layer: 0 },
        { id: 'b', layer: 1 },
        { id: 'c', layer: 2 },
        { id: 'd', layer: 3 },
        { id: 'e', layer: 1 },
        { id: 'f', layer: 0 },
        { id: 'g', layer: 0 }
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'd' },
        { from: 'f', to: 'e' },
        { from: 'a', to: 'd' }
      ],
      numLayer: 4
    };

    const result = orderNodes(graph);
    expect(result.nodes[0].order).toBe(0);
    expect(result.nodes[1].order).toBe(0);
    expect(result.nodes[2].order).toBe(0);
    expect(result.nodes[3].order).toBe(0);
    expect(result.nodes[4].order).toBe(1);
    expect(result.nodes[5].order).toBe(1);
    expect(result.nodes[6].order).toBe(2);
  });
});