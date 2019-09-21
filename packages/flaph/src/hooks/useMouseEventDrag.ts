import React, { useState } from 'react';
import { Position } from '../types';
import { add, subtract } from '../utils/location';
import { DragState, Snap, useDrag } from './useDrag';

export type MouseDragHandler = {
  start: (e: React.MouseEvent, basePosition: { x: number, y: number }, snaps?: Snap[]) => void
  process: (e: React.MouseEvent) => boolean
  quit: () => void
};

export function useMouseEventDrag(): [DragState, MouseDragHandler] {
  const [dragState, handler] = useDrag();
  const [offsetState, setOffset] = useState<Position | null>(null);

  function start(e: React.MouseEvent, basePosition: { x: number, y: number }, snaps?: Snap[]) {
    const offset = subtract({ x: e.clientX, y: e.clientY }, basePosition);
    if (snaps) {
      for (const snap of snaps) {
        snap.x += offset.x;
        snap.y += offset.y;
      }
    }
    setOffset(offset);
    handler.start(e.clientX, e.clientY, snaps);
  }

  function process(e: React.MouseEvent) {
    return handler.process(e.clientX, e.clientY);
  }

  function quit() {
    handler.quit();
  }

  return [
    dragState === null ? null : {
      ...dragState,
      start: add(offsetState, dragState.start),
      current: add(offsetState, dragState.current)
    },
    { start, process, quit }
  ];
}
