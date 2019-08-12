import React, { useState } from 'react';
import { ControlProperties, Layout } from '../types';
import ControlLayer from './ControlLayer';
import GraphLayer from './GraphLayer';

type PatchRequestHandler = ({ patchRequest: PatchRequest }) => void;
type Props = {
  layout: Layout
  onChange: PatchRequestHandler
};

export default function Flaph(props: Props) {
  const { onChange } = props;
  const [control, setControl] = useState<ControlProperties | null>(null);

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
        onChange={ onChange }
        onDisableControl={ () => setControl(null) }
      />
    </div>
  );
}
