import React, { useState } from 'react';

type ResizeEvent = {
  offset: {
    x: number
    y: number
  }
}

type Props = {
  width: number
  height: number
  onResizeStart: (e: ResizeEvent) => void
  onResizing: (e: ResizeEvent) => void
  onResizeEnd: (e: ResizeEvent) => void
}

type Position = {
  x: number
  y: number
}

export default function ResizeKnob(props: Props): JSX.Element {
  const knobSize = 8;
  const eventTrapBounds = 1000;

  const [startPosition, setStartPosition] = useState<Position | null>(null);

  const handleMouseUp = (e: React.MouseEvent) => {
    props.onResizeStart({
      offset: {
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      }
    });
    setStartPosition(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPosition) {
      props.onResizing({
        offset: {
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y,
        }
      });
      setStartPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    props.onResizeStart({
      offset: {
        x: 0,
        y: 0
      }
    })
  };

  return (
    <React.Fragment>
      {
        startPosition === null ? null : (
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
        x={ props.width - knobSize / 2 }
        y={ props.height - knobSize / 2 }
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
  )
}
