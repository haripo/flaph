import React, { useState } from 'react';
import { Layout, TextChangeEvent, TextControlProperties } from '../../types';

type Props = {
  control: TextControlProperties
  layout: Layout
  onChange: (e: TextChangeEvent) => void
};

export default function TextControl(props: Props) {
  const { x, y, width, height } = props.control.location;
  const [currentValue, setCurrentValue] = useState(props.control.value);

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
            defaultValue={ currentValue }
            onChange={ (e) => {
              props.onChange({
                changeType: 'change-text',
                elementId: props.control.target.id,
                patch: {
                  value: e.target.value
                }
              });
              setCurrentValue(e.target.value);
            } }
            autoFocus={ true }
            style={ {
              textAlign: 'center',
              width,
              height,
              border: 'none',
              outline: 'none',
              pointerEvents: 'auto'
            } }
          />
        </foreignObject>
      </g>
    </React.Fragment>
  );
}
