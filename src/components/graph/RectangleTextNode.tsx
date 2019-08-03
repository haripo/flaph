import React, { useState } from 'react';
import EditableText from './EditableText';
import ResizeKnob from './ResizeKnob';
import { BoxLayoutElement } from '../../types';

type Props = {
  node: BoxLayoutElement,
  onChange: (e: { [key: string]: string }) => void
}

export default function RectangleTextNode(props: Props) {
  const { node } = props;
  const [hovered, setHovered] = useState(false);

  return (
    <g
      key={ node.id }
      transform={ `translate(${node.location.x - node.location.width / 2}, ${node.location.y - node.location.height / 2})` }
      style={{
        overflow: 'visible'
      }}
      onMouseEnter={ e => setHovered(true) }
      onMouseLeave={ e => setHovered(false) }
  >
      <rect
        x={ 0 }
        y={ 0 }
        width={ node.location.width }
        height={ node.location.height }
        stroke={ 'black' }
        strokeDasharray={ hovered ? '3 3' : 'none' }
        fill={ 'white' }
      />
      {
        !hovered ? null : (
          <ResizeKnob
            width={ node.location.width }
            height= { node.location.height }
            onResized={ () => {} }
            onResizing={ e => {
              props.onChange(
                {
                  width: (node.location.width + e.offset.x).toString(),
                  height: (node.location.height + e.offset.y).toString()
                }
              );
            }
            }
          />
        )
      }
      <EditableText
        value={ node.model.properties['body'] }
        width={ node.location.width }
        height={ node.location.height }
        onChange={ text => props.onChange({ body: text }) }
      />
    </g>
  )
}