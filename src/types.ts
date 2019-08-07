
export type GraphModel = ModelElement[]
export type ModelElement = {
  id: string
  type: string
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

export type Layout = LayoutElement[]
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