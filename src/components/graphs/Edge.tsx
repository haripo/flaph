import React from 'react';
import { BoxLocation, PathLocation } from '../../types';

type Props = {
  location: PathLocation
  onClick: React.MouseEventHandler
};

export default function Edge(props: Props) {
  const result = [];
  const points = props.location;
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
          onClick={ props.onClick }
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
