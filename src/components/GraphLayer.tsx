import React from 'react';
import TextBox from './graphs/TextBox';
import { ControllerProperties, Layout, PathLayoutElement } from '../types';

type PatchRequestHandler = ({ patchRequest: PatchRequest }) => void;
type Props = {
  layout: Layout
  onChange: PatchRequestHandler
  requestControl: (request: ControllerProperties) => void
}

function renderEdge(element: PathLayoutElement, onChange: PatchRequestHandler) {
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

function makeChangeEvent(elementId: string, patch: { [key: string]: string }) {
  return {
    patchRequest: {
      elementId,
      patch
    }
  };
}

export default function GraphLayer(props: Props) {
  const { onChange } = props;

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
              return (
                <TextBox
                  key={ element.id }
                  node={ element }
                  onChange={ e => onChange(makeChangeEvent(element.id, e)) }
                  onControlActivated={ e => props.requestControl({
                    type: 'box',
                    target: element,
                    capability: {
                      canMove: false,
                      canResize: true,
                      canEditConstraint: false
                    }
                  }) }
                  onTextClicked={ e => props.requestControl({
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
            case 'path':
              return renderEdge(element, props.onChange)
          }
        })
      }
    </svg>
  )
}
