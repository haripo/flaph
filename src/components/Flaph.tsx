import React, { useState } from 'react';
import { ChangeEvent, ControlProperties, Layout } from '../types';
import ControlLayer  from './ControlLayer';
import GraphLayer from './GraphLayer';

type Props = {
  layout: Layout
  onChange: (e: ChangeEvent) => void
};

export default function Flaph(props: Props) {
  const [control, setControl] = useState<ControlProperties | null>(null);

  const handleChange = (e: ChangeEvent) => {
    if (e.clearControls) {
      setControl(null);
    }
    props.onChange(e);
  };

  return (
    <div
      style={ {
        position: 'relative',
        width: '100%',
        height: '100%'
      } }
    >
      <div
        style={ {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        } }
        onClick={ () => setControl(null) }
      />
      <GraphLayer
        layout={ props.layout }
        requestControl={ (e) => setControl(e) }
      />
      <ControlLayer
        control={ control }
        layout={ props.layout }
        onChange={ handleChange }
      />
    </div>
  );
}
