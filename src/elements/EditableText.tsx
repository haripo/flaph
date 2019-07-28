import React, { useState } from 'react';
import { Node } from '../Main';

type Props = {
  node: Node,
  onChange: (node: Node) => void
}

export default function EditableText(props: Props) {
  const { node } = props;
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <foreignObject width={ node.layout.width } height={ node.layout.height }>
        <input
          defaultValue={ node.contents.title }
          onChange={ e => {
            props.onChange({
              ...node,
              contents: {
                ...node.contents,
                title: e.target.value
              }
            });
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
          { node.contents.title }
        </text>
      </svg>
    )
  }
}