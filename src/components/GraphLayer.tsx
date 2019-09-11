import React from 'react';
import { ControlProperties, Layout } from '../types';
import Edge from './graphs/Edge';
import Node from './graphs/Node';

type Props = {
  layout: Layout
  requestControl: (request: ControlProperties) => void
};

export default function GraphLayer(props: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      style={ {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      } }
    >
      {
        Object.values(props.layout).map((element) => {
          const commonProps = {
            key: element.id,
            onControlRequested: props.requestControl
          };
          switch (element.type) {
            case 'node':
              return <Node { ...commonProps } layout={ element } />;
            case 'edge':
              return <Edge { ...commonProps } layout={ element } />;
          }
        })
      }
    </svg>
  );
}
