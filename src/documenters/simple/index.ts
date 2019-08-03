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

export function patch(source: string, request: PatchRequest, sourceMap: GraphSourceMap): string {
  let patchSlideSize = 0;
  for (let [key, patch] of Object.entries(request.patch)) {
    const range = sourceMap[request.elementId][key];
    if (range) {
      // replace value
      source =
        source.slice(0, range.start + patchSlideSize)
        + patch
        + source.slice(range.end + patchSlideSize)
      patchSlideSize += patch.length - (range.end - range.start);
    } else {
      // insert new key-value
      const newLine = `\n  ${key}: ${patch}`;
      const insertPosition = Object.values(sourceMap[request.elementId])
        .map(range => range.end)
        .reduce((p, c) => p > c ? p : c);
      source =
        source.slice(0, insertPosition + patchSlideSize)
        + newLine
        + source.slice(insertPosition + patchSlideSize)
      patchSlideSize += newLine.length;
    }
  }
  return source;
}
