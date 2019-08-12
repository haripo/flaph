import React from 'react';
import { ControlProperties, Layout, PatchRequest } from '../types';
import BoxControl from './controls/BoxControl';
import TextControl from './controls/TextControl';

type Props = {
  control: ControlProperties
  layout: Layout
  onChange: (e: { patchRequest: PatchRequest }) => void
};

function renderControl(props: Props) {
  const { control } = props;
  if (!control) { return null; }

  switch (control.type) {
    case 'box':
      return (
        <BoxControl
          key={ control.target.id }
          elementId={ control.target.id }
          location={ control.location }
          layout={ props.layout }
          canMove={ control.canMove }
          canResize={ control.canResize }
          canEditConstraint={ control.canEditConstraint }
          onChange={ (e) => props.onChange({
            patchRequest: {
              elementId: control.target.id,
              patch: e
            }
          }) }
          onConstraintChange={ (e) => props.onChange({
            patchRequest: {
              elementId: '@constraint.' + e.type,
              patch: {
                nodes: e.nodes.join(',')
              }
            }
          }) }
        />
      );
    case 'text':
      return (
        <TextControl
          key={ control.target.id }
          value={ control.value }
          location={ control.location }
          onChange={ (e) => {
            props.onChange({
              patchRequest: {
                elementId: control.target.id,
                patch: {
                  body: e.target.value
                }
              }
            });
          } }
        />
      );
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
