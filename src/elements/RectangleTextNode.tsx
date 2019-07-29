import React from 'react';
import { Node } from '../Main';
import EditableText from './EditableText';

type Props = {
  node: Node,
  onChange: (node: Node) => void
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
      <EditableText node={ node } onChange={ props.onChange } />
    </g>
  )
}