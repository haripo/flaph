declare module '*.pegjs' {
  interface ParserOptions {
    startRule?: string;
    tracer: any;
  }

  export interface Location {
    start: {
      offset: number,
      line: number,
      column: number
    };
    end: {
      offset: number,
      line: number,
      column: number
    };
  }

  export class SyntaxError extends Error {
    public message: string;
    public expected: string | null;
    public found: string | null;
    public location: Location;
    public name: 'SyntaxError';
  }

  export function parse(input: string, options?: ParserOptions): any;
}
