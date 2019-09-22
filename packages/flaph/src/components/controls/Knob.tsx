import React from 'react';
import { DragState, useDrag } from '../../hooks/useDrag';

export type ResizeEvent = DragState;

type Props = {
  x: number
  y: number
  onResizeStart?: (e: ResizeEvent) => void
  onResizing?: (e: ResizeEvent) => void
  onResizeEnd?: (e: ResizeEvent) => void
};

export default function Knob(props: Props): JSX.Element {
  const knobSize = 8;
  const eventTrapBounds = 10000;

  const [dragState, dragHandler] = useDrag();

  const handleMouseUp = (e: React.MouseEvent) => {
    if (props.onResizeEnd) {
      props.onResizeEnd(dragState);
    }
    dragHandler.quit();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dragged = dragHandler.process(e.clientX, e.clientY);
    if (dragged && props.onResizing) {
      props.onResizing(dragState);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragHandler.start(e.clientX, e.clientY);
    if (props.onResizeStart) {
      props.onResizeStart(dragState);
    }
  };

  return (
    <React.Fragment>
      {
        dragState && (
          <rect
            fill="transparent"
            x={ -eventTrapBounds / 2 }
            y={ -eventTrapBounds / 2 }
            width={ eventTrapBounds }
            height={ eventTrapBounds }
            onMouseUp={ handleMouseUp }
            onMouseMove={ handleMouseMove }
            style={ {
              pointerEvents: 'all'
            } }
          />
        )
      }
      <rect
        x={ props.x - knobSize / 2 }
        y={ props.y - knobSize / 2 }
        width={ knobSize }
        height={ knobSize }
        stroke={ '#039be5' }
        fill={ 'white' }
        style={ {
          pointerEvents: 'all'
        } }
        onMouseUp={ handleMouseUp }
        onMouseMove={ handleMouseMove }
        onMouseDown={ handleMouseDown }
      />
    </React.Fragment>
  );
}
