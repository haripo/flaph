import { useState } from 'react';
import { Position } from '../types';

export type Snap = {
  id: string
  x: number
  y: number
};

export type SnapResult = Snap & {
  axis: 'vertical' | 'horizontal'
};

export type DragState = {
  movement: Position
  offset: Position
  current: Position
  start: Position,
  snap: SnapResult[]
};

export type DragHandler = {
  start: (x: number, y: number, snaps?: Snap[]) => void
  process: (x: number, y: number) => boolean
  quit: () => void
};

function findSnap(x: number, y: number, snaps: Snap[]): SnapResult[] {
  const result = [];
  for (const snap of snaps) {
    if (Math.abs(x - snap.x) < 15) {
      result.push({
        ...snap,
        axis: 'vertical'
      });
    }
    if (Math.abs(y - snap.y) < 15) {
      result.push({
        ...snap,
        axis: 'horizontal'
      });
    }
  }
  return result;
}

export function useDrag(): [DragState, DragHandler] {
  const [state, setState] = useState<DragState | null>(null);
  const [snapState, setSnaps] = useState<Snap[]>([]);

  function start(x: number, y: number, snaps?: Snap[]) {
    setState({
      start: { x, y },
      current: { x, y },
      movement: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      snap: []
    });

    if (snaps) {
      setSnaps(snaps);
    }
  }

  function process(x: number, y: number) {
    if (state === null) {
      return false;
    }

    const snapResults = findSnap(x, y, snapState);
    for (const snap of snapResults) {
      if (snap.axis === 'vertical') {
        x = snap.x;
      }
      if (snap.axis === 'horizontal') {
        y = snap.y;
      }
    }

    setState({
      start: state.start,
      current: { x, y },
      movement: {
        x: x - state.current.x,
        y: y - state.current.y
      },
      offset: {
        x: x - state.start.x,
        y: y - state.start.y
      },
      snap: snapResults
    });

    return true;
  }

  function quit() {
    setState(null);
  }

  return [state, { start, process, quit }];
}
