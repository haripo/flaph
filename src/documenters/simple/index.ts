import { GraphModel, GraphSourceMap, PatchRequest } from '../../types';
import peg from './simple.pegjs';

type ParseResult = {
  status: 'succeeded',
  model: GraphModel,
  sourceMap: GraphSourceMap
} | {
  status: 'failed'
};

class Tracer {
  public trace(e) {
    if (e.type === 'rule.match') {
      // console.log(e);
    }
  }
}

function arrayToObject(key: string, value: string, array: any[]) {
  return array.reduce(
    (r, c) => {
      r[c[key]] = c[value];
      return r;
    },
    {});
}

export function parse(graphSource: string): ParseResult {
  try {
    const parsed = peg.parse(graphSource, { tracer: new Tracer() });

    const model: GraphModel = {
      elements: {},
      constraints: {}
    };

    for (const e of parsed) {
      if (e.id.startsWith('@constraint')) {
        model.constraints[e.id] = {
          id: e.id,
          properties: e.properties
        };
      } else {
        model.elements[e.id] = {
          id: e.id,
          type: 'node',
          properties: e.properties
        };
      }
    }

    return {
      status: 'succeeded',
      model,
      sourceMap: arrayToObject('id', 'sourceMap', parsed)
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'failed'
    };
  }
}

export function patch(source: string, request: PatchRequest, sourceMap: GraphSourceMap): string {
  let patchSlideSize = 0;
  if (request.elementId in sourceMap) {
    for (const [key, patchText] of Object.entries(request.patch)) {
      const range = sourceMap[request.elementId][key];
      if (range) {
        // replace value
        source =
          source.slice(0, range.start + patchSlideSize)
          + patchText
          + source.slice(range.end + patchSlideSize);
        patchSlideSize += patchText.length - (range.end - range.start);
      } else {
        // insert new key-value
        const newLine = `\n  ${ key }: ${ patchText }`;
        const insertPosition = Object.values(sourceMap[request.elementId])
          .map((r) => r.end)
          .reduce((p, c) => p > c ? p : c);
        source =
          source.slice(0, insertPosition + patchSlideSize)
          + newLine
          + source.slice(insertPosition + patchSlideSize);
        patchSlideSize += newLine.length;
      }
    }
  } else {
    // create new element
    source += `${request.elementId}: {\n`;
    source += Object.entries(request.patch).map(([k, v]) => `  ${k}: ${v}`).join('\n');
    source += '\n}';
  }
  return source;
}
