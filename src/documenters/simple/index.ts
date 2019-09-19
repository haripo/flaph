import { ChangeEvent, GraphModel, GraphSourceMap, PatchRequest } from '../../types';
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

    const model: GraphModel = {};

    for (const e of parsed) {
      if (e.id.startsWith('@constraint')) {
        // model.push({
        //   id: e.id,
        //   type: 'constraint'
        // });
      } else {
        model[e.id] = {
          id: e.id,
          type: 'node',
          properties: {
            body: e.properties.body,
            width: e.properties.width ? parseInt(e.properties.width, 10) : undefined,
            height: e.properties.height ? parseInt(e.properties.height, 10) : undefined
          },
          controlProperties: {
            canMove: false,
            canResize: true,
            canEditConstraint: false
          }
        };

        if (e.properties.to !== undefined) {
          const id = `edge-${e.id}-${e.properties.to}`;
          model[id] = {
            id,
            type: 'edge',
            properties: {
              from: e.id,
              to: e.properties.to as string
            },
            controlProperties: {
              snaps: []
            }
          };
        }
      }
    }

    // append snap locations
    const snaps = Object.values(model)
      .filter((l) => l.type === 'node')
      .map((l) => l.id);
    for (const e of Object.values(model)) {
      if (e.type === 'edge') {
        e.controlProperties.snaps = snaps;
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

function makePatchFromEvent(e: ChangeEvent, model: GraphModel): PatchRequest | null {
  switch (model[e.elementId].type) {
    case 'node':
      switch (e.changeType) {
        case 'move':
          return {
            elementId: e.elementId,
            patch: {
              x: e.patch.x.toString(),
              y: e.patch.y.toString()
            }
          };
        case 'resize':
          return {
            elementId: e.elementId,
            patch: {
              width: e.patch.width.toString(),
              height: e.patch.height.toString()
            }
          };
        case 'change-text':
          return {
            elementId: e.elementId,
            patch: {
              body: e.patch.value
            }
          };
        default:
          return null;
      }
    case 'edge':
      switch (e.changeType) {
        case 'change-link':
          return {
            elementId: e.patch.from,
            patch: {
              to: e.patch.to
            }
          };
        default:
          return null;
      }
    default:
      return null;
  }
}

export function patch(source: string, e: ChangeEvent, model: GraphModel, sourceMap: GraphSourceMap): string {
  const patchObject = makePatchFromEvent(e, model);

  let patchSlideSize = 0;
  if (patchObject.elementId in sourceMap) {
    for (const [key, patchText] of Object.entries(patchObject.patch)) {
      const range = sourceMap[patchObject.elementId][key];
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
        const insertPosition = Object.values(sourceMap[patchObject.elementId])
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
    source += `${patchObject.elementId}: {\n`;
    source += Object.entries(patchObject.patch).map(([k, v]) => `  ${k}: ${v}`).join('\n');
    source += '\n}';
  }
  return source;
}
