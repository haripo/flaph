import React from 'react';

import { ChangeEvent, ControlProperties, Layout, PatchRequest } from '../types';

import BoxControl from './controls/BoxControl';
import LineControl from './controls/LineControl';
import TextControl from './controls/TextControl';

type Props = {
  control: ControlProperties
  layout: Layout
  onChange: (e: ChangeEvent) => void
};

function renderControl(props: Props) {
  const { control } = props;
  if (!control) { return null; }

  const commonProps = {
    key: control.target.id,
    layout: props.layout,
    onChange: props.onChange
  };

  switch (control.type) {
    case 'node':
      return <BoxControl { ...commonProps } control={ control } />;
    case 'line':
      return <LineControl { ...commonProps } control={ control } />;
    case 'text':
      return <TextControl { ...commonProps } control={ control } />;
    default:
      return null;
  }
}

export default function ControlLayer(props: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      style={ {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      } }>
      { renderControl(props) }
    </svg>
  );
}
