import React, { useState } from 'react';
import ResizeKnob from './ResizeKnob';
import { BoxLayoutElement, ControllerCapability, Layout } from '../../types';

type Props = {
  elementId: string
  x: number
  y: number
  width: number
  height: number
  layout: Layout
  capability: ControllerCapability
  children?: React.ReactNode
  onChange: (e: { [key: string]: string }) => void
  onConstraintChange: (e: { type: 'horizontal' | 'vertical', nodes: string[] }) => void
}

type DragStartPositions = {
  box: {
    x: number
    y: number
  }
  mouse: {
    x: number
    y: number
  }
}

export default function BoxController(props: Props) {
  const padding = 6;

  const [size, setSize] = useState({ width: props.width, height: props.height });
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [dragStartPositions, setDragStartPositions] = useState<DragStartPositions | null>(null);

  const exitDragging = () => {
    const layoutElement = props.layout[props.elementId] as BoxLayoutElement;
    setDragStartPositions(null);
    setPosition({
      x: layoutElement.location.x,
      y: layoutElement.location.y
    });
  };

  return (
    <React.Fragment>
      { props.children }
      <g transform={ `translate(${ position.x - padding }, ${ position.y - padding })` }>
        <rect
          width={ size.width + padding * 2 }
          height={ size.height + padding * 2 }
          stroke={ 'transparent' }
          strokeWidth={ dragStartPositions ? 80 : 20 }
          fill={ 'none' }
          style={ { pointerEvents: 'stroke' } }
          onMouseDown={ e => setDragStartPositions({
            mouse: { x: e.clientX, y: e.clientY },
            box: { x: position.x, y: position.y }
          }) }
          onMouseUp={ e => exitDragging() }
          onMouseLeave={ e => exitDragging() }
          onMouseMove={ e => {
            if (dragStartPositions) {
              let newPosition = {
                x: Math.round(dragStartPositions.box.x - (dragStartPositions.mouse.x - e.clientX)),
                y: Math.round(dragStartPositions.box.y - (dragStartPositions.mouse.y - e.clientY))
              };

              // snap
              let constraints = [];
              for (let element of Object.values(props.layout)) {
                if (element.type !== 'box') continue;
                if (Math.abs(element.location.x - newPosition.x) < 15) {
                  newPosition.x = element.location.x;
                  props.onConstraintChange({
                    type: 'vertical',
                    nodes: [element.id, props.elementId]
                  });
                }
                if (Math.abs(element.location.y - newPosition.y) < 15) {
                  newPosition.y = element.location.y;
                  props.onConstraintChange({
                    type: 'horizontal',
                    nodes: [element.id, props.elementId]
                  });
                }
              }

              setPosition(newPosition);
              if (props.capability.canMove) {
                props.onChange({
                  x: newPosition.x.toString(),
                  y: newPosition.y.toString()
                });
              }
            }
          } }
        />
        <rect
          width={ size.width + padding * 2 }
          height={ size.height + padding * 2 }
          stroke={ '#039be5' }
          strokeDasharray={ '2 2' }
          strokeWidth={ 1 }
          fill={ 'none' }
        />
        { !props.capability.canResize ? null :
          (
            <ResizeKnob
              width={ size.width + padding * 2 }
              height={ size.height + padding * 2 }
              onResizeStart={ () => {
              } }
              onResizeEnd={ () => {
              } }
              onResizing={ e => {
                const newSize = {
                  width: size.width + e.offset.x,
                  height: size.height + e.offset.y
                };
                setSize(newSize);
                props.onChange(
                  {
                    width: newSize.width.toString(),
                    height: newSize.height.toString()
                  }
                );
              } }
            />
          )
        }
      </g>
    </React.Fragment>
  )
}