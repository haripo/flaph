import React from 'react';
import { BoxLocation } from '../../types';

type Props = {
  value: string
  location: BoxLocation
  onClick: React.MouseEventHandler
  onTextClick: React.MouseEventHandler
}

export default function TextBox(props: Props) {
  const { x, y, width, height } = props.location;

  return (
    <g
      transform={ `translate(${ x }, ${ y })` }
    >
      <rect
        x={ 0 }
        y={ 0 }
        width={ width }
        height={ height }
        stroke={ 'black' }
        fill={ 'white' }
        style={ {
          overflow: 'hidden',
          pointerEvents: 'auto'
        } }
        onClick={ props.onClick }
      />
      <svg
        onClick={ props.onTextClick }
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <text
          x={ width / 2 }
          y={ height / 2 }
          textAnchor="middle"
          dominantBaseline="central"
        >
          { props.value }
        </text>
      </svg>
    </g>
  )
}