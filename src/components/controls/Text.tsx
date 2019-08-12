import React, { ChangeEventHandler } from 'react';

type Props = {
  elementId: string
  x: number
  y: number
  width: number
  height: number
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

export default function TextController(props: Props) {
  return (
    <React.Fragment>
      <g transform={ `translate(${ props.x }, ${ props.y })` }>
        <rect
          width={ props.width }
          height={ props.height }
          stroke={ '#039be5' }
          strokeWidth={ 2 }
          strokeDasharray={ '2 2' }
          fill={ 'none' }
        />
        <foreignObject width={ props.width } height={ props.height }>
          <input
            defaultValue={ props.value }
            onChange={ props.onChange }
            autoFocus={ true }
            style={ {
              textAlign: 'center',
              width: props.width,
              height: props.height,
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