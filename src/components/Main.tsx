import React, { useState } from 'react';
import { layout } from '../designers/dagre';
import { getPatchRequest, parse, patch } from '../documenters/simple';
import Flaph from './Flaph';

const defaultSource = `1: {
  body: Node1
  to: 2
}
2: {
  body: Node2
}
3: {
  body: Node3Node3Node3Node3
  to: 2
}
4: {
  body: Node4
  to: 3
}
5: {
  body: Node5
  width: 200
}
6: {
  body: Node6
  to:4
  width: 50
  height: 200
}

@constraint.horizontal: {
  nodes: 2,3
}
`;

export default function Main() {
  const [source, setSource] = useState(defaultSource);
  const parseResult = parse(source);
  const layouted = parseResult.status === 'succeeded' ? layout(parseResult.model) : null;

  return (
    <div style={ {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      padding: 20
    } }>
      <textarea
        value={ source }
        onChange={ (e) => setSource(e.target.value) }
        style={ {
          width: 600,
          padding: 8,
          fontFamily: 'monaco',
          fontSize: 16
        } }
      />
      <div style={ {
        marginLeft: 20,
        flex: 1
      } }>
        {
          parseResult.status === 'succeeded' ? (
            <Flaph
              layout={ layouted }
              onChange={ (e) => {
                const r = getPatchRequest(e, parseResult.model);
                console.info('patch', r);
                setSource(patch(source, r, parseResult.sourceMap));
              } }
            />
          ) : (
            <div>parse error</div>
          ) }
      </div>
    </div>
  );
}
