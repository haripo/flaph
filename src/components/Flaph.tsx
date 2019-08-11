import React, { useState } from 'react';
import { ControllerProperties, Layout } from '../types';
import ControlLayer from './ControlLayer';
import GraphLayer from './GraphLayer';
import { layout } from '../designers/dagre';
import { patch } from '../documenters/simple';

type PatchRequestHandler = ({ patchRequest: PatchRequest }) => void;
type Props = {
  layout: Layout
  onChange: PatchRequestHandler
}

export default function Flaph(props: Props) {
  const { onChange } = props;
  const [controller, setController] = useState<ControllerProperties | null>(null);

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
        onClick={ () => setController(null) }
      />
      <GraphLayer
        layout={ props.layout }
        onChange={ props.onChange }
        requestControl={ e => setController(e) }
      />
      <ControlLayer
        controller={ controller }
        layout={ props.layout }
        onChange={ e => {
          onChange(e);
        } }
      />
    </div>
  )
}
