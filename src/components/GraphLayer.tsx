import React from 'react';
import { BoxLayoutElement, ControlProperties, Layout, PathLayoutElement } from '../types';
import { extend } from '../utils/location';
import TextBox from './graphs/TextBox';

type Props = {
  layout: Layout
  requestControl: (request: ControlProperties) => void
};

function renderEdge(element: PathLayoutElement) {
  const result = [];
  const points = element.location;
  for (let i = 0; i < points.length - 1; i++) {
    result.push(
      <line
        key={ element.id + '-' + i }
        x1={ points[i].x }
        y1={ points[i].y }
        x2={ points[i + 1].x }
        y2={ points[i + 1].y }
        stroke={ 'black' }
        strokeWidth={ 1 }
      />
    );
  }
  return result;
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
              return renderEdge(element);
          }
        })
      }
    </svg>
  );
}
