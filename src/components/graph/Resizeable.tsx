import React, { useState } from 'react';
import EditableText from './EditableText';
import ResizeKnob from './ResizeKnob';
import { BoxLayoutElement } from '../../types';

type Props = {
  x: number
  y: number
  width: number
  height: number
  children?: React.ReactNode
  onChange: (e: { [key: string]: string }) => void
}

export default function Resizable(props: Props) {
  const padding = 6;

  const { x, y, width, height, onChange } = props;
  const [hovered, setHovered] = useState(false);

  return (
    <g
      onMouseEnter={ e => setHovered(true) }
      onMouseLeave={ e => setHovered(false) }
  >
    {
      hovered ? (
        <React.Fragment>
          { props.children }
          <g transform={ `translate(${x - padding}, ${y - padding})` }>
            <rect // for capturing mouse events
              width={ width + padding * 2 }
              height={ height + padding * 2 }
              strokeWidth={ 30 }
              stroke={ 'transparent' }
              fill={ 'none' }
            />
            <rect
              width={ width + padding * 2 }
              height={ height + padding * 2 }
              stroke={ '#039be5' }
              strokeDasharray={ '2 2' }
              strokeWidth={ 1 }
              fill={ 'none' }
            />
            <ResizeKnob
              width={ width + padding * 2 }
              height= { height + padding * 2 }
              onResized={ () => {} }
              onResizing={ e => {
                props.onChange(
                  {
                    width: (width + e.offset.x).toString(),
                    height: (height + e.offset.y).toString()
                  }
                );
              }
              }
            />
          </g>
        </React.Fragment>
      ) : (
        props.children
      )
    }
    </g>
  )
}