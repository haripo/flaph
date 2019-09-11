import React from 'react';
import { ControlProperties, EdgeLayoutElement } from '../../types';

type Props = {
  layout: EdgeLayoutElement
  onControlRequested: (e: ControlProperties) => void
};

export default function Edge(props: Props) {
  const result = [];
  const points = props.layout.location;

  function handleClick() {
    props.onControlRequested({
      type: 'line',
      target: props.layout,
      location: props.layout.location,
      ...props.layout.model.controlProperties
    });
  }

  for (let i = 0; i < points.length - 1; i++) {
    result.push(
      <React.Fragment key={ i }>
        <line
          x1={ points[i].x }
          y1={ points[i].y }
          x2={ points[i + 1].x }
          y2={ points[i + 1].y }
          stroke={ 'transparent' }
          strokeWidth={ 20 }
          strokeLinecap={ 'round' }
          style={ { pointerEvents: 'all' } }
          onClick={ handleClick }
        />
        <line
          x1={ points[i].x }
          y1={ points[i].y }
          x2={ points[i + 1].x }
          y2={ points[i + 1].y }
          stroke={ 'black' }
          strokeWidth={ 1 }
        />
      </React.Fragment>
    );
  }
  return (
    <g>
      { result }
    </g>
  );
}
