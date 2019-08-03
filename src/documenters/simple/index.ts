import peg from './simple.pegjs';
import { GraphModel, GraphSourceMap, PatchRequest } from '../../types';

type ParseResult = {
  status: 'succeeded',
  model: GraphModel,
  sourceMap: GraphSourceMap
} | {
  status: 'failed',
}

class Tracer {
  trace(e) {
    if (e.type === 'rule.match') {
      if (e.rule === 'key') {
        console.log(e);
      }
    }
  }
}

function arrayToObject(key: string, value: string, array: any[]) {
  return array.reduce(
    (r, c) => {
      r[c[key]] = c[value];
      return r
    },
    {});
}

export function parse(graphSource: string): ParseResult {
  try {
    const parsed = peg.parse(graphSource, { tracer: new Tracer() });
    return {
      status: 'succeeded',
      model: parsed.map(e => ({
        id: e['id'],
        type: 'node',
        properties: e['properties']
      })),
      sourceMap: arrayToObject('id', 'sourceMap', parsed)
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'failed'
    };
  }
}

export function patch(source: string, request: PatchRequest, sourceMap: any): string {
  let patchSlideSize = 0;
  for (let [key, patch] of Object.entries(request.patch)) {
    const { start, end } = sourceMap[request.elementId][key];
    source =
      source.slice(0, start + patchSlideSize)
      + patch
      + source.slice(end + patchSlideSize)
    patchSlideSize += patch.length - (end - start);
  }
  return source;
}
