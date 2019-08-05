import React from 'react';
import RectangleTextNode from './RectangleTextNode';
import { Layout, BoxLayoutElement, PathLayoutElement } from '../../types';
import Resizable from './Resizeable';

type PatchRequestHandler = ({ patchRequest: PatchRequest }) => void;
type Props = {
  layout: Layout
  onNodeChange: PatchRequestHandler
}

function renderNode(element: BoxLayoutElement, onChange: PatchRequestHandler) {
  const { x, y, width, height } = element.location;
  return (
    <Resizable
      key={element.id}
      x={ x - width / 2 }
      y={ y - height / 2 }
      width={ width }
      height={ height }
      onChange={ (e) => onChange({
        patchRequest: {
          elementId: element.id,
          patch: e
        }
      }) }
    >
      <RectangleTextNode
        node={element}
        onChange={ (e) => onChange({
          patchRequest: {
            elementId: element.id,
            patch: e
          }
        }) }
        />
    </Resizable>
  );
}

function renderEdge(element: PathLayoutElement, onChange: PatchRequestHandler) {
  const result = [];
  const points = element.location;
  for (let i = 0; i < points.length - 1; i++) {
    result.push(
      <line
        key={element.id + '-' + i}
        x1={points[i].x}
        y1={points[i].y}
        x2={points[i + 1].x}
        y2={points[i + 1].y}
        stroke={'black'}
        strokeWidth={1}
      />
    );
  }
  return result;
}

export default function Graph(props: Props) {
  return (
    <svg width='100%' height='100%'>
      {
        props.layout.map(element => {
          switch (element.type) {
            case 'box':
              return renderNode(element, props.onNodeChange)
            case 'path':
              return renderEdge(element, props.onNodeChange)
          }
        })
      }
    </svg>
  )
}
