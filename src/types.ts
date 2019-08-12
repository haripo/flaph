
export type GraphModel = {
  elements: { [id: string]: ModelElement }
  constraints: { [id: string]: ModelConstraint }
};

export type ModelElement = {
  id: string
  type: string
  properties: {
    [key: string]: string
  }
};

export type ModelConstraint = {
  id: string
  properties: {
    [key: string]: string
  }
};

export type GraphSourceMap = {
  [elementId: string]: {
    [key: string]: {
      start: number,
      end: number
    }
  }
};

export type Layout = { [id: string]: LayoutElement };
export type LayoutElementBase = {
  id: string | null
  model: ModelElement | null
};
export type BoxLayoutElement = LayoutElementBase & {
  type: 'box',
  location: BoxLocation
};
export type PathLayoutElement = LayoutElementBase & {
  type: 'path',
  location: PathLocation
};
export type LayoutElement = BoxLayoutElement | PathLayoutElement;

export type PatchRequest = {
  elementId: string
  patch: { [key: string]: string }
};

export type BoxControlProperties = {
  type: 'box'
  location: BoxLocation
  canResize: boolean
  canMove: boolean
  canEditConstraint: boolean
};

export type TextControlProperties = {
  type: 'text'
  value: string
  location: BoxLocation
};

export type ControlProperties = (
  BoxControlProperties |
  TextControlProperties) & {
  target: LayoutElement
};

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
