
export type GraphModel = {
  elements: { [id: string]: ModelElement }
  constraints: { [id: string]: ModelConstraint }
}

export type ModelElement = {
  id: string
  type: string
  properties: {
    [key: string]: string
  }
}

export type ModelConstraint = {
  id: string
  properties: {
    [key: string]: string
  }
}

export type GraphSourceMap = {
  [elementId: string]: {
    [key: string]: {
      start: number,
      end: number
    }
  }
}

export type Layout = { [id: string]: LayoutElement }
export type LayoutElementBase = {
  id: string | null
  model: ModelElement | null
}
export type BoxLayoutElement = LayoutElementBase & {
  type: 'box',
  location: { x: number, y: number, width: number, height: number }
};
export type PathLayoutElement = LayoutElementBase & {
  type: 'path',
  location: { x: number, y: number }[]
};
export type LayoutElement = BoxLayoutElement | PathLayoutElement;

export type PatchRequest = {
  elementId: string
  patch: { [key: string]: string }
}

export type ControllerCapability = {
  canResize: boolean
  canMove: boolean
  canEditConstraint: boolean
}

export type BoxControllerProperties = {
  type: 'box'
  target: LayoutElement
  capability: ControllerCapability
}

export type TextControllerProperties = {
  type: 'text'
  target: LayoutElement
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type ControllerProperties = BoxControllerProperties | TextControllerProperties;