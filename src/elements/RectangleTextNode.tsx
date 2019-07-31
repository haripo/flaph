import React from 'react';
import { RenderedNode } from '../Main';
import EditableText from './EditableText';

type Props = {
  node: RenderedNode,
  onChange: ({id, key, body}) => void
}

export default function RectangleTextNode(props: Props) {
  const { node } = props;

  return (
    <g
      transform={ `translate(${node.layout.x - node.layout.width / 2}, ${node.layout.y - node.layout.height / 2})` }
      key={ node.id }
    >
      <rect
        x={ 0 }
        y={ 0 }
        width={ node.layout.width }
        height={ node.layout.height }
        stroke={ 'black' }
        fill={ 'none' }
      >
      </rect>
      <EditableText
        node={ node }
        onChange={ text => props.onChange({ id: node.id, key: 'body', body: text }) }
      />
    </g>
  )
}