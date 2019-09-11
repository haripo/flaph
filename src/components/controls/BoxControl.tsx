import React, { useState } from 'react';
import { useMouseEventDrag } from '../../hooks/useMouseEventDrag';
import { BoxChangeEvent, BoxControlProperties, Layout, NodeLayoutElement } from '../../types';
import Knob, { ResizeEvent } from './Knob';

type Props = {
  control: BoxControlProperties
  layout: Layout
  onChange: (e: BoxChangeEvent) => void
};

export default function BoxControl(props: Props) {
  const padding = 6;

  const { control } = props;

  const [size, setSize] = useState({ width: control.location.width, height: control.location.height });
  const [dragState, dragHandler] = useMouseEventDrag();

  const exitDrag = () => {
    dragHandler.quit();
  };

  const processDrag = (e: React.MouseEvent) => {
    const dragged = dragHandler.process(e);
    if (dragged) {
      if (control.canMove) {
        props.onChange({
          elementId: props.control.target.id,
          changeType: 'move',
          patch: {
            x: dragState.current.x,
            y: dragState.current.y
          }
        });
      }

      if (props.control.canEditConstraint) {
        for (const snap of dragState.snap) {
          props.onChange({
            elementId: props.control.target.id,
            changeType: 'change-constraint',
            patch: {
              axis: snap.axis,
              targets: [snap.id]
            }
          });
        }
      }
    }
  };

  const startDrag = (e: React.MouseEvent) => {
    let snaps;

    if (props.control.canEditConstraint) {
      snaps = Object.values(props.layout)
        .filter((l) => l.type === 'node')
        .map((l: NodeLayoutElement) => ({
          id: l.id,
          x: l.location.x,
          y: l.location.y
        }));
    }

    dragHandler.start(e, props.control.location, snaps);
  };

  const processResize = (e: ResizeEvent) => {
    const newSize = {
      width: size.width + e.movement.x,
      height: size.height + e.movement.y
    };
    setSize(newSize);
    props.onChange({
      elementId: props.control.target.id,
      changeType: 'resize',
      patch: {
        width: newSize.width,
        height: newSize.height
      }
    });
  };

  const position = dragState ? {
    x: props.control.location.x + dragState.offset.x,
    y: props.control.location.y + dragState.offset.y
  } : props.control.location;

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
        { !props.control.canResize ? null :
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
