import React, { useState } from 'react';
import ResizeKnob from './ResizeKnob';

type Props = {
  x: number
  y: number
  width: number
  height: number
  children?: React.ReactNode
  onChange: (e: { [key: string]: string }) => void
}

export default function BoxController(props: Props) {
  const padding = 6;

  const { x, y } = props;
  const [size, setSize] = useState({ width: props.width, height: props.height });

  return (
    <React.Fragment>
      { props.children }
      <g transform={ `translate(${ x - padding }, ${ y - padding })` }>
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
          }
          }
        />
      </g>
    </React.Fragment>
  )
}