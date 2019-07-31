import pegParser from './peg/simple.pegjs';

class Tracer {
  trace() {
  }
}

export function parse(text: string) {
  try {
    return {
      succeeded: true,
      result: pegParser.parse(text, { tracer: new Tracer() })
    };
  } catch (e) {
    console.error(e);
    return {
      succeeded: false,
      result: ''
    };
  }
}
