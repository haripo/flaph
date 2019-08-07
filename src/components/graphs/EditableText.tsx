import React, { useState } from 'react';

type Props = {
  value: string
  width: number
  height: number
  onChange: (value: string) => void
}

export default function EditableText(props: Props) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <foreignObject width={ props.width } height={ props.height }>
        <input
          defaultValue={ props.value }
          onChange={ e => {
            props.onChange(e.target.value);
          } }
          onBlur={ e => setIsEditing(false) }
          style={ {
            border: 0,
            width: props.width,
            height: props.height,
          } }
        />
      </foreignObject>
    )
  } else {
    return (
      <svg
        onClick={ e => setIsEditing(true) }
        style={{
          userSelect: 'none'
        }}
      >
        <text
          x={ props.width / 2 }
          y={ props.height / 2 }
          textAnchor="middle"
          dominantBaseline="central"
        >
          { props.value }
        </text>
      </svg>
    )
  }
}