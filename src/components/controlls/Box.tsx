import React, { useState } from 'react';
import ResizeKnob from './ResizeKnob';
import { BoxLayoutElement, Layout } from '../../types';
import { Simulate } from 'react-dom/test-utils';

type Props = {
  elementId: string
  x: number
  y: number
  width: number
  height: number
  layout: Layout
  children?: React.ReactNode
  onChange: (e: { [key: string]: string }) => void
}

export default function BoxController(props: Props) {
  const padding = 6;

  const [size, setSize] = useState({ width: props.width, height: props.height });
  const [position, setPosition] = useState({ x: props.x, y: props.y });
  const [dragging, setDragging] = useState(false);

  const exitDragging = () => {
    const layoutElement = props.layout[props.elementId] as BoxLayoutElement;
    setDragging(false);
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
          strokeWidth={ dragging ? 80 : 20 }
          fill={ 'none' }
          style={ { pointerEvents: 'stroke' } }
          onMouseDown={ e => setDragging(true) }
          onMouseUp={ e => exitDragging() }
          onMouseLeave={ e => exitDragging() }
          onMouseMove={ e => {
            if (dragging) {
              setPosition({
                x: position.x + e.movementX,
                y: position.y + e.movementY
              });
              props.onChange({
                x: Math.round(position.x + e.movementX).toString(),
                y: Math.round(position.y + e.movementY).toString()
              });
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
      </g>
    </React.Fragment>
  )
}