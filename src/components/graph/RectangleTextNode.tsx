import React from 'react';
import EditableText from './EditableText';
import { BoxLayoutElement } from '../../types';

type Props = {
  node: BoxLayoutElement,
  onChange: (body: string) => void
}

export default function RectangleTextNode(props: Props) {
  const { node } = props;

  return (
    <g
      transform={ `translate(${node.location.x - node.location.width / 2}, ${node.location.y - node.location.height / 2})` }
      key={ node.id }
    >
      <rect
        x={ 0 }
        y={ 0 }
        width={ node.location.width }
        height={ node.location.height }
        stroke={ 'black' }
        fill={ 'none' }
      >
      </rect>
      <EditableText
        value={ node.model.properties['body'] }
        width={ node.location.width }
        height={ node.location.height }
        onChange={ text => props.onChange(text) }
      />
    </g>
  )
}