import React, { useState } from 'react';

type Position = {
  x: number
  y: number
};

type ResizeEvent = {
  movement: Position
  offset: Position
  current: Position
  start: Position
};

type Props = {
  x: number
  y: number
  onResizeStart?: (e: ResizeEvent) => void
  onResizing?: (e: ResizeEvent) => void
  onResizeEnd?: (e: ResizeEvent) => void
};

export default function Knob(props: Props): JSX.Element {
  const knobSize = 8;
  const eventTrapBounds = 1000;

  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

  const handleMouseUp = (e: React.MouseEvent) => {
    if (props.onResizeEnd) {
      props.onResizeEnd({
        start: startPosition,
        current: currentPosition,
        movement: {
          x: e.clientX - currentPosition.x,
          y: e.clientY - currentPosition.y
        },
        offset: {
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y
        }
      });
    }
    setStartPosition(null);
    setCurrentPosition(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPosition) {
      if (props.onResizing) {
        props.onResizing({
          start: startPosition,
          current: currentPosition,
          movement: {
            x: e.clientX - currentPosition.x,
            y: e.clientY - currentPosition.y
          },
          offset: {
            x: e.clientX - startPosition.x,
            y: e.clientY - startPosition.y
          }
        });
      }
      setCurrentPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    setCurrentPosition({ x: e.clientX, y: e.clientY });
    if (props.onResizeStart) {
      props.onResizeStart({
        start: startPosition,
        current: currentPosition,
        movement: {
          x: 0,
          y: 0
        },
        offset: {
          x: 0,
          y: 0
        }
      });
    }
  };

  return (
    <React.Fragment>
      {
        currentPosition === null ? null : (
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
