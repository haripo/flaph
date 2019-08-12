declare module '*.pegjs' {
  interface IParserOptions {
    startRule?: string;
    tracer: any;
  }

  export interface ILocation {
    start: {
      offset: number,
      line: number,
      column: number
    }
    end: {
      offset: number,
      line: number,
      column: number
    }
  }

  export class SyntaxError extends Error {
    message: string;
    expected: string | null;
    found: string | null;
    location: Location;
    name: 'SyntaxError';
  }

  export function parse(input: string, options?: IParserOptions): any;
}
