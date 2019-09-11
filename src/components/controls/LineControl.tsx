import React, { useState } from 'react';
import { EdgeGraphElement, Layout, LineChangeEvent, LineControlProperties } from '../../types';
import Knob from './Knob';

type Props = {
  control: LineControlProperties
  layout: Layout
  onChange: (e: LineChangeEvent) => void
};

export default function LineControl(props: Props) {
  const [points, setPoints] = useState(props.control.location);
  const [dragStartPositions, setDragStartPositions] = useState<{ x: number, y: number } | null>(null);

  const getSnapped = ({ x, y }: { x: number, y: number }): { id: string, x: number, y: number } | null => {
    for (const snap of props.control.snaps) {
      const target = props.layout[snap];
      if (target.type === 'node') {
        const snapX = target.location.x + target.location.width / 2;
        const snapY = target.location.y + target.location.height / 2;
        if (Math.abs(snapX - x) < target.location.width / 2 &&
          Math.abs(snapY - y) < target.location.height / 2) {
          return {
            id: target.id,
            x: snapX,
            y: snapY
          };
        }
      }
    }
    return null;
  };

  const result = [];
  for (let i = 0; i < points.length - 1; i++) {
    result.push(
      <React.Fragment key={ i }>
        <line
          x1={ points[i].x }
          y1={ points[i].y }
          x2={ points[i + 1].x }
          y2={ points[i + 1].y }
          stroke={ 'white' }
          strokeWidth={ 2 }
          strokeLinecap={ 'round' }
        />
        <line
          x1={ points[i].x }
          y1={ points[i].y }
          x2={ points[i + 1].x }
          y2={ points[i + 1].y }
          stroke={ '#039be5' }
          strokeDasharray={ '2 2' }
        />
      </React.Fragment>
    );
  }

  const knobPoint = points.length - 1;
  return (
    <React.Fragment>
      { result }
      <Knob
        x={ points[knobPoint].x }
        y={ points[knobPoint].y }
        onResizeStart={ (e) => {
          setDragStartPositions(points[knobPoint]);
        }}
        onResizing={ (e) => {
          const newPoints = [{
            x: points[0].x,
            y: points[0].y
          }, {
            x: dragStartPositions.x + e.offset.x,
            y: dragStartPositions.y + e.offset.y
          }];
          const snap = getSnapped(newPoints[newPoints.length - 1]);
          if (snap) {
            newPoints[newPoints.length - 1].x = snap.x;
            newPoints[newPoints.length - 1].y = snap.y;
          }
          setPoints(newPoints);
        } }
        onResizeEnd={ () => {
          const snapped = getSnapped(points[knobPoint]);
          const snapId = snapped ? snapped.id : null;
          if (snapId) {
            const p = knobPoint === 0 ? {
              from: snapId,
              to: (props.control.target.model as EdgeGraphElement).properties.from
            } : {
              from: (props.control.target.model as EdgeGraphElement).properties.from,
              to: snapId
            };

            props.onChange({
              elementId: props.control.target.id,
              changeType: 'change-link',
              patch: {
                from: p.from,
                to: p.to
              },
              clearControls: true
            });
          }
          setPoints(props.control.location);
        }}
      />
    </React.Fragment>
  );
}
