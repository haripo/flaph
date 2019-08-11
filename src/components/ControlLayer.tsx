import { ControllerProperties, Layout, PatchRequest } from '../types';
import BoxController from './controls/Box';
import TextController from './controls/Text';
import React from 'react';

function renderControl(props: { controller: ControllerProperties, layout: Layout, onChange: (e: { patchRequest: PatchRequest }) => void }) {
  const { controller } = props;
  if (!controller) return null;

  switch (controller.type) {
    case 'box':
      if (controller.target.type !== 'box') {
        throw 'invalid';
      }
      return (
        <BoxController
          key={ controller.target.id }
          elementId={ controller.target.id }
          x={ controller.target.location.x }
          y={ controller.target.location.y }
          width={ controller.target.location.width }
          height={ controller.target.location.height }
          layout={ props.layout }
          capability={ controller.capability }
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
          x={ controller.bounds.x }
          y={ controller.bounds.y }
          width={ controller.bounds.width }
          height={ controller.bounds.height }
          elementId={ controller.target.id }
          layout={ props.layout }
          value={ controller.target.model.properties['body'] }
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