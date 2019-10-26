
type GraphModelElementBase = {
  id: string
  type: string
};

export type NodeGraphElement = GraphModelElementBase & {
  type: 'node'
  properties: {
    body: string
    width?: number
    height?: number
  }
  controlProperties: {
    canMove: boolean
    canResize: boolean
    canEditConstraint: boolean
  }
};

export type EdgeGraphElement = GraphModelElementBase & {
  type: 'edge'
  properties: {
    // body: string
    from: string
    to: string
  }
  controlProperties: {
    snaps: string[]
  }
};

export type ConstraintGraphElement = GraphModelElementBase & {
  type: 'constraint'
  properties: {
    axis: 'horizontal' | 'vertical'
    nodes: string[]
  }
  controlProperties: {
  }
};

export type GraphElement = NodeGraphElement | EdgeGraphElement | ConstraintGraphElement;
export type GraphModel = { [id: string]: GraphElement };

export type GraphSourceMap = {
  [elementId: string]: {
    [key: string]: {
      start: number,
      end: number
    }
  }
};

type LayoutElementBase = {
  id: string | null
  model: GraphModelElementBase | null
};

export type NodeLayoutElement = LayoutElementBase & {
  type: 'node'
  location: BoxLocation
  model: NodeGraphElement
};

export type EdgeLayoutElement = LayoutElementBase & {
  type: 'edge'
  location: PathLocation
  model: EdgeGraphElement
};

export type LayoutElement = NodeLayoutElement | EdgeLayoutElement;
export type Layout = { [id: string]: LayoutElement };

export type PatchRequest = {
  elementId: string
  patch: { [key: string]: string }
};

export type BoxControlProperties = {
  type: 'node'
  target: LayoutElement
  location: BoxLocation
  canResize: boolean
  canMove: boolean
  canEditConstraint: boolean
};

export type LineControlProperties = {
  type: 'line'
  target: LayoutElement
  location: PathLocation
  snaps: string[]
};

export type TextControlProperties = {
  type: 'text'
  target: LayoutElement
  value: string
  location: BoxLocation
};

export type ControlProperties =
  BoxControlProperties |
  LineControlProperties |
  TextControlProperties;

export type BoxLocation = {
  x: number
  y: number
  width: number
  height: number
};

export type PathLocation = Array<{
  x: number
  y: number
}>;

export type Position = {
  x: number
  y: number
};

export type ChangeEventBase = {
  elementId: string
  changeType: string
  clearControls?: boolean
};

export type BoxMoveEvent = ChangeEventBase & {
  changeType: 'move'
  patch: {
    x: number
    y: number
  }
};

export type BoxResizeEvent = ChangeEventBase & {
  changeType: 'resize'
  patch: {
    width: number
    height: number
  }
};

export type BoxChangeConstraintEvent = ChangeEventBase & {
  changeType: 'change-constraint'
  patch: {
    axis: 'horizontal' | 'vertical'
    targets: string[]
  }
};

export type BoxChangeEvent =
  BoxMoveEvent |
  BoxResizeEvent |
  BoxChangeConstraintEvent;

export type LineChangeLinkEvent = ChangeEventBase & {
  changeType: 'change-link'
  patch: {
    from: string
    to: string
  }
};

export type LineChangeEvent = LineChangeLinkEvent;

export type TextChangeEvent = ChangeEventBase & {
  changeType: 'change-text'
  patch: {
    value: string
  }
};

export type ChangeEvent = BoxChangeEvent | LineChangeEvent | TextChangeEvent;
