import React, { ChangeEventHandler } from 'react';
import { BoxLocation } from '../../types';

type Props = {
  value: string
  location: BoxLocation
  onChange: ChangeEventHandler<HTMLInputElement>
}

export default function TextControl(props: Props) {
  const { x, y, width, height } = props.location;

  return (
    <React.Fragment>
      <g transform={ `translate(${ x }, ${ y })` }>
        <rect
          width={ width }
          height={ height }
          stroke={ '#039be5' }
          strokeWidth={ 2 }
          strokeDasharray={ '2 2' }
          fill={ 'none' }
        />
        <foreignObject width={ width } height={ height }>
          <input
            defaultValue={ props.value }
            onChange={ props.onChange }
            autoFocus={ true }
            style={ {
              textAlign: 'center',
              width: width,
              height: height,
              border: 'none',
              outline: 'none',
              pointerEvents: 'auto'
            } }
          />
        </foreignObject>
      </g>
    </React.Fragment>
  )
}