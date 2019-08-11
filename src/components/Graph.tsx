import React, { useState } from 'react';
import TextBox from './graphs/TextBox';
import { ControllerProperties, Layout, LayoutElement, PatchRequest, PathLayoutElement } from '../types';
import BoxController from './controlls/Box';
import TextController from './controlls/Text';

type PatchRequestHandler = ({ patchRequest: PatchRequest }) => void;
type Props = {
  layout: Layout
  onChange: PatchRequestHandler
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

function Controllers(props: { controller: ControllerProperties, layout: Layout, onChange: (e: { patchRequest: PatchRequest }) => void }) {
  const { controller } = props;
  if (!controller) return null;

  switch (controller.type) {
    case 'box':
      if (controller.target.type !== 'box') {
        throw 'invalid';
      }
      return (
        <BoxController
          key={ controller.target.id }
          elementId={ controller.target.id }
          x={ controller.target.location.x }
          y={ controller.target.location.y }
          width={ controller.target.location.width }
          height={ controller.target.location.height }
          layout={ props.layout }
          capability={ controller.capability }
          onChange={ (e) => props.onChange({
            patchRequest: {
              elementId: controller.target.id,
              patch: e
            }
          }) }
          onConstraintChange={ e => props.onChange({
            patchRequest: {
              elementId: '@constraint.' + e.type,
              patch: {
                nodes: e.nodes.join(',')
              }
            }
          }) }
        />
      );
    case 'text':
      return (
        <TextController
          key={ controller.target.id }
          x={ controller.bounds.x }
          y={ controller.bounds.y }
          width={ controller.bounds.width }
          height={ controller.bounds.height }
          elementId={ controller.target.id }
          layout={ props.layout }
          value={ controller.target.model.properties['body'] }
          onChange={ e => {
            props.onChange({
              patchRequest: {
                elementId: controller.target.id,
                patch: {
                  body: e.target.value
                }
              }
            })
          } }
        />
      )
    default:
      return null;
  }
}

export default function Graph(props: Props) {
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
                    onControlActivated={ e => setController({
                      type: 'box',
                      target: element,
                      capability: {
                        canMove: false,
                        canResize: true,
                        canEditConstraint: false
                      }
                    }) }
                    onTextClicked={ e => setController({
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
      <svg
        width='100%'
        height='100%'
        style={ {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        } }>
        <Controllers
          controller={ controller }
          layout={ props.layout }
          onChange={ e => {
            onChange(e);
          } }
        />
      </svg>
    </div>
  )
}
