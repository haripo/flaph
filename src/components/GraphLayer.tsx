import React from 'react';
import { BoxLayoutElement, ControlProperties, Layout, PathLayoutElement } from '../types';
import { extend } from '../utils/location';
import Edge from './graphs/Edge';
import TextBox from './graphs/TextBox';

type Props = {
  layout: Layout
  requestControl: (request: ControlProperties) => void
};

function renderEdge(element: PathLayoutElement, requestControl: (request: ControlProperties) => void) {
  return (
    <Edge
      key={ element.id }
      location={ element.location }
      onClick={ (e) => {
        requestControl({
          type: 'line',
          target: element,
          location: element.location
        });
      } }
    />
  );
}

function renderNode(element: BoxLayoutElement, requestControl: (request: ControlProperties) => void) {
  return (
    <TextBox
      key={ element.id }
      value={ element.model.properties.body }
      location={ element.location }
      onClick={ () => requestControl({
        type: 'box',
        target: element,
        location: element.location,
        canMove: false,
        canResize: true,
        canEditConstraint: false
      }) }
      onTextClick={ () => requestControl({
        type: 'text',
        value: element.model.properties.body,
        target: element,
        location: extend(element.location, -6)
      }) }
    />
  );
}

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
          switch (element.type) {
            case 'box':
              return renderNode(element, props.requestControl);
            case 'path':
              return renderEdge(element, props.requestControl);
          }
        })
      }
    </svg>
  );
}
