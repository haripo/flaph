import React, { useState } from 'react';
import EditableText from './EditableText';
import { BoxLayoutElement } from '../../types';

type Props = {
  node: BoxLayoutElement,
  onClick: React.MouseEventHandler
  onChange: (e: { [key: string]: string }) => void
}

export default function RectangleTextNode(props: Props) {
  const { node } = props;

  return (
    <g
      key={ node.id }
      transform={ `translate(${ node.location.x }, ${ node.location.y })` }
      style={ {
        overflow: 'hidden',
        pointerEvents: 'auto'
      } }
      onClick={ props.onClick }
    >
      <rect
        x={ 0 }
        y={ 0 }
        width={ node.location.width }
        height={ node.location.height }
        stroke={ 'black' }
        fill={ 'white' }
      />
      <EditableText
        value={ node.model.properties['body'] }
        width={ node.location.width }
        height={ node.location.height }
        onChange={ text => props.onChange({ body: text }) }
      />
    </g>
  )
}