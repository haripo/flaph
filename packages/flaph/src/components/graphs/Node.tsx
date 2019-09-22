import React from 'react';
import { ControlProperties, LayoutElement, NodeLayoutElement } from '../../types';
import { extend } from '../../utils/location';

type Props = {
  layout: NodeLayoutElement,
  onControlRequested: (e: ControlProperties) => void
};

export default function Node(props: Props) {
  const { x, y, width, height } = props.layout.location;

  const handleClick = () => {
    props.onControlRequested({
      type: 'node',
      target: props.layout as LayoutElement,
      location: props.layout.location,
      ...props.layout.model.controlProperties
    });
  };

  const handleTextClick = () => {
    props.onControlRequested({
      type: 'text',
      target: props.layout,
      location: extend(props.layout.location, -6),
      value: props.layout.model.properties.body
    });
  };

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
        onClick={ handleClick }
      />
      <svg
        onClick={ handleTextClick }
        style={ {
          pointerEvents: 'auto',
          userSelect: 'none'
        } }
      >
        <text
          x={ width / 2 }
          y={ height / 2 }
          textAnchor="middle"
          dominantBaseline="central"
        >
          { props.layout.model.properties.body }
        </text>
      </svg>
    </g>
  );
}
