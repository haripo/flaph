import React from 'react';
import TextBox from './graphs/TextBox';
import { BoxLayoutElement, ControllerProperties, Layout, PathLayoutElement } from '../types';

type Props = {
  layout: Layout
  requestControl: (request: ControllerProperties) => void
}

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

function renderNode(element: BoxLayoutElement, requestControl: (request: ControllerProperties) => void) {
  return (
    <TextBox
      key={ element.id }
      node={ element }
      onClick={ e => requestControl({
        type: 'box',
        target: element,
        capability: {
          canMove: false,
          canResize: true,
          canEditConstraint: false
        }
      }) }
      onTextClick={ e => requestControl({
        type: 'text',
        target: element,
        bounds: {
          x: element.location.x + 6,
          y: element.location.y + 6,
          width: element.location.width - 12,
          height: element.location.height - 12
        }
      }) }
    />
  );
}

export default function GraphLayer(props: Props) {
  return (
    <svg
      width='100%'
      height='100%'
      style={ {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      } }
    >
      {
        Object.values(props.layout).map(element => {
          switch (element.type) {
            case 'box':
              return renderNode(element, props.requestControl);
            case 'path':
              return renderEdge(element);
          }
        })
      }
    </svg>
  )
}
