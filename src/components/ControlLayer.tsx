import { ControllerProperties, Layout, PatchRequest } from '../types';
import BoxController from './controls/Box';
import TextController from './controls/Text';
import React from 'react';

function renderControl(props: { controller: ControllerProperties, layout: Layout, onChange: (e: { patchRequest: PatchRequest }) => void }) {
  const { controller } = props;
  if (!controller) return null;

  switch (controller.type) {
    case 'box':
      return (
        <BoxController
          key={ controller.target.id }
          elementId={ controller.target.id }
          x={ controller.location.x }
          y={ controller.location.y }
          width={ controller.location.width }
          height={ controller.location.height }
          layout={ props.layout }
          canMove={ controller.canMove }
          canResize={ controller.canResize }
          canEditConstraint={ controller.canEditConstraint }
          onChange={ (e) => props.onChange({
            patchRequest: {
              elementId: controller.target.id,
              patch: e
            }
          }) }
          onConstraintChange={ e => props.onChange({
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
        <TextController
          key={ controller.target.id }
          x={ controller.location.x }
          y={ controller.location.y }
          width={ controller.location.width }
          height={ controller.location.height }
          elementId={ controller.target.id }
          value={ controller.value }
          onChange={ e => {
            props.onChange({
              patchRequest: {
                elementId: controller.target.id,
                patch: {
                  body: e.target.value
                }
              }
            })
          } }
        />
      );
    default:
      return null;
  }
}

export default function ControlLayer(props: { controller: ControllerProperties, layout: Layout, onChange: (e: { patchRequest: PatchRequest }) => void }) {
  return (
    <svg
      width='100%'
      height='100%'
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