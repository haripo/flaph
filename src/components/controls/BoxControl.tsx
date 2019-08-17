import React, { useState } from 'react';
import { useMouseEventDrag } from '../../hooks/useMouseEventDrag';
import { BoxLayoutElement, BoxLocation, Layout } from '../../types';
import Knob, { ResizeEvent } from './Knob';

type Props = {
  elementId: string

  location: BoxLocation
  layout: Layout

  canResize: boolean
  canMove: boolean
  canEditConstraint: boolean

  onChange: (e: { [key: string]: string }) => void
  onConstraintChange: (e: { type: 'horizontal' | 'vertical', nodes: string[] }) => void
};

export default function BoxControl(props: Props) {
  const padding = 6;

  const [size, setSize] = useState({ width: props.location.width, height: props.location.height });
  const [dragState, dragHandler] = useMouseEventDrag();

  const exitDrag = () => {
    dragHandler.quit();
  };

  const processDrag = (e: React.MouseEvent) => {
    const dragged = dragHandler.process(e);
    if (dragged) {
      if (props.canMove) {
        props.onChange({
          x: dragState.current.x.toString(),
          y: dragState.current.y.toString()
        });
      }

      if (props.canEditConstraint) {
        for (const snap of dragState.snap) {
          props.onConstraintChange({
            type: snap.axis,
            nodes: [snap.id]
          });
        }
      }
    }
  };

  const startDrag = (e: React.MouseEvent) => {
    let snaps;

    if (props.canEditConstraint) {
      snaps = Object.values(props.layout)
        .filter((l) => l.type === 'box')
        .map((l: BoxLayoutElement) => ({
          id: l.id,
          x: l.location.x,
          y: l.location.y
        }));
    }

    dragHandler.start(e, props.location, snaps);
  };

  const processResize = (e: ResizeEvent) => {
    const newSize = {
      width: size.width + e.movement.x,
      height: size.height + e.movement.y
    };
    setSize(newSize);
    props.onChange(
      {
        width: newSize.width.toString(),
        height: newSize.height.toString()
      }
    );
  };

  const position = dragState ? {
    x: props.location.x + dragState.offset.x,
    y: props.location.y + dragState.offset.y
  } : props.location;

  return (
    <React.Fragment>
      <g transform={ `translate(${ position.x - padding }, ${ position.y - padding })` }>
        <rect
          width={ size.width + padding * 2 }
          height={ size.height + padding * 2 }
          stroke={ 'transparent' }
          strokeWidth={ dragState ? 360 : 20 }
          fill={ 'none' }
          style={ { pointerEvents: 'all' } }
          onMouseDown={ startDrag }
          onMouseUp={ exitDrag }
          onMouseLeave={ exitDrag }
          onMouseMove={ processDrag }
        />
        <rect
          width={ size.width + padding * 2 }
          height={ size.height + padding * 2 }
          stroke={ '#039be5' }
          strokeDasharray={ '2 2' }
          strokeWidth={ 1 }
          fill={ 'none' }
        />
        { !props.canResize ? null :
          (
            <Knob
              x={ size.width + padding * 2 }
              y={ size.height + padding * 2 }
              onResizing={ processResize }
            />
          )
        }
      </g>
    </React.Fragment>
  );
}
