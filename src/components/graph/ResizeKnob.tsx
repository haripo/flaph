import React, { useState } from 'react';

type Props = {
  width: number
  height: number
  onResizing: (e: { offset: { x: number, y: number } }) => void
  onResized: () => void
}

type Position = {
  x: number
  y: number
}

type ResizeState = {
  startPosition: {
    x: number
    y: number
  }
  currentPosition: {
    x: number
    y: number
  }
}

export default function ResizeKnob(props: Props): JSX.Element {
  const knobSize = 8;
  const eventTrapBounds = 1000;

  const [startPosition, setStartPosition] = useState<Position | null>(null);

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
  }

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
            onMouseMove={ handleMouseMove }
            onMouseUp={ () => setStartPosition(null) }
          />
        )
      }
      <rect
        x={ props.width - knobSize / 2 }
        y={ props.height - knobSize / 2 }
        width={ knobSize }
        height={ knobSize }
        stroke={ 'black' }
        fill={ 'white' }
        onMouseUp={ () => setStartPosition(null) }
        onMouseMove={ handleMouseMove }
        onMouseDown={ e => setStartPosition({ x: e.clientX, y: e.clientY }) }
      />
    </React.Fragment>
  )
}
