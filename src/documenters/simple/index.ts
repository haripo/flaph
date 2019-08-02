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
  for (let [key, patch] of Object.entries(request.patch)) {
    if (key === 'body') {
      source =
        source.slice(0, sourceMap[request.elementId][key].start)
        + patch
        + source.slice(sourceMap[request.elementId][key].end)
    }
    // TODO: patch したら start, end がずれる
  }
  return source;
}
