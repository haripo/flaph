import React, { CSSProperties, useState } from 'react';
// import { layoutGraph } from '../designers/dagreLayouter';
import { layoutGraph } from '../designers/sugiyamaLayouter';
import { parse, patch } from '../documenters/simple';
import { ChangeEvent, ControlProperties } from '../types';
import ControlLayer from './ControlLayer';
import GraphLayer from './GraphLayer';

export interface Props {
  source: string;
  style?: CSSProperties;
  onChange: (e: { source: string }) => void;
}

export default function Flaph(props: Props) {
  const [control, setControl] = useState<ControlProperties | null>(null);

  const parseResult = parse(props.source);
  if (parseResult.status === 'failed') {
    return <span>Failed to parse</span>;
  }

  const layout = layoutGraph(parseResult.model);
  if (layout === null) {
    return <span>Failed to layout</span>;
  }

  const handleChange = (e: ChangeEvent) => {
    if (e.clearControls) {
      setControl(null);
    }
    const updated = patch(props.source, e, parseResult.model, parseResult.sourceMap);
    props.onChange({ source: updated });
  };

  return (
    <div
      style={ {
        ...props.style,
        position: 'relative'
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
        layout={ layout }
        requestControl={ (e) => setControl(e) }
      />
      <ControlLayer
        control={ control }
        layout={ layout }
        onChange={ handleChange }
      />
    </div>
  );
}
