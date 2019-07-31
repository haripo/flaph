import React, { useState } from 'react';
import { RenderedNode } from '../Main';

type Props = {
  node: RenderedNode,
  onChange: (text: string) => void
}

export default function EditableText(props: Props) {
  const { node } = props;
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <foreignObject width={ node.layout.width } height={ node.layout.height }>
        <input
          defaultValue={ node.contents.body }
          onChange={ e => {
            props.onChange(e.target.value);
          } }
          onBlur={ e => setIsEditing(false) }
          style={ {
            border: 0,
            width: node.layout.width,
            height: node.layout.height,
          } }
        />
      </foreignObject>
    )
  } else {
    return (
      <svg onClick={ e => setIsEditing(true) }>
        <text
          x={ node.layout.width / 2 }
          y={ node.layout.height / 2 }
          textAnchor="middle"
          dominantBaseline="central"
        >
          { node.contents.body }
        </text>
      </svg>
    )
  }
}