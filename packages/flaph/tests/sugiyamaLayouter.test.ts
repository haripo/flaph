import { removeCycles, Graph } from '../src/designers/sugiyamaLayouter';

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