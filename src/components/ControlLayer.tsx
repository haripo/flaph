import React from 'react';

import { BoxLayoutElement, ControlProperties, Layout, PatchRequest } from '../types';

import BoxControl from './controls/BoxControl';
import LineControl from './controls/LineControl';
import TextControl from './controls/TextControl';

type Props = {
  control: ControlProperties
  layout: Layout
  onChange: (e: { patchRequest: PatchRequest }) => void
  onDisableControl: () => void
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
    case 'line':
      return (
        <LineControl
          key={ control.target.id }
          location={ control.location }
          snapPoints={ Object.values(props.layout)
            .filter((l) => l.type === 'box')
            .map((l: BoxLayoutElement) => ({ id: l.id, x: l.location.x, y: l.location.y }))
          }
          onMoveEnd={ (e) => {
            if (e.snapId) {
              const points = e.movedPointIndex === 0 ? {
                from: e.snapId,
                to: control.target.model.properties.from
              } : {
                from: control.target.model.properties.from,
                to: e.snapId
              };
              props.onChange({
                patchRequest: {
                  elementId: points.from,
                  patch: {
                    to: points.to
                  }
                }
              });
              props.onDisableControl();
            }
          } }
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
