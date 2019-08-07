import React, { useState } from 'react';
import TextBox from './graphs/TextBox';
import { Layout, LayoutElement, PatchRequest, PathLayoutElement } from '../types';
import BoxController from './controlls/Box';

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

type Controller = {
  target: LayoutElement
  // properties: any
}

function Controllers(props: { controller: Controller, onChange: (e: { patchRequest: PatchRequest }) => void }) {
  const { controller } = props;
  if (!controller) return null;

  switch (controller.target.type) {
    case 'box':
      return (
        <BoxController
          key={ controller.target.id }
          x={ controller.target.location.x }
          y={ controller.target.location.y }
          width={ controller.target.location.width }
          height={ controller.target.location.height }
          onChange={ (e) => props.onChange({
            patchRequest: {
              elementId: controller.target.id,
              patch: e
            }
          }) }
        />
      );
    default:
      return null;
  }
}

export default function Graph(props: Props) {
  const { onChange } = props;
  const [controller, setController] = useState<Controller | null>(null);

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
          props.layout.map(element => {
            switch (element.type) {
              case 'box':
                return (
                  <TextBox
                    key={ element.id }
                    node={ element }
                    onChange={ e => onChange(makeChangeEvent(element.id, e)) }
                    onClick={ e => setController({ target: element }) }
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
          onChange={ e => {
            onChange(e);
          } }
        />
      </svg>
    </div>
  )
}
