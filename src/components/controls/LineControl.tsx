import React, { useState } from 'react';
import { PathLocation } from '../../types';
import Knob from './Knob';

export interface MoveEndEvent {
  x: number;
  y: number;
  movedPointIndex: number;
  snapId: string;
}

export interface SnapPoint {
  id: string;
  x: number;
  y: number;
}

type Props = {
  location: PathLocation
  snapPoints: SnapPoint[]
  onMoveEnd: (e: MoveEndEvent) => void
};

export default function LineControl(props: Props) {
  const [points, setPoints] = useState(props.location);
  const [dragStartPositions, setDragStartPositions] = useState<{ x: number, y: number } | null>(null);

  const getSnapped = ({ x, y }: { x: number, y: number }): SnapPoint | null => {
    for (const snap of props.snapPoints) {
      if (Math.abs(snap.x - x) < 15 &&
        Math.abs(snap.y - y) < 15) {
        return snap;
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
          props.onMoveEnd({
            x: points[knobPoint].x,
            y: points[knobPoint].y,
            snapId: snapped ? snapped.id : null,
            movedPointIndex: knobPoint
          });
          setPoints(props.location);
        }}
      />
    </React.Fragment>
  );
}
