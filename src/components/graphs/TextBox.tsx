import React from 'react';
import { BoxLayoutElement } from '../../types';

type Props = {
  node: BoxLayoutElement,
  onControlActivated: React.MouseEventHandler
  onTextClicked: React.MouseEventHandler
  onChange: (e: { [key: string]: string }) => void
}

export default function TextBox(props: Props) {
  const { node } = props;

  return (
    <g
      key={ node.id }
      transform={ `translate(${ node.location.x }, ${ node.location.y })` }
    >
      <rect
        x={ 0 }
        y={ 0 }
        width={ node.location.width }
        height={ node.location.height }
        stroke={ 'black' }
        fill={ 'white' }
        style={ {
          overflow: 'hidden',
          pointerEvents: 'auto'
        } }
        onClick={ props.onControlActivated }
      />
      <svg
        onClick={ props.onTextClicked }
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <text
          x={ node.location.width / 2 }
          y={ node.location.height / 2 }
          textAnchor="middle"
          dominantBaseline="central"
        >
          { node.model.properties['body'] }
        </text>
      </svg>
    </g>
  )
}