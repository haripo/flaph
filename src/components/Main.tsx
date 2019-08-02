import React, { useState } from 'react';
import Graph from './graph/Graph';
import { parse, patch } from '../documenters/simple';
import { layout } from '../designers/dagre';

const defaultSource = `1: {
  body: jjjjj
  to: 2
}
2: {
  body: iiii
}
`;

export default function Main() {
  const [source, setSource] = useState(defaultSource);
  const parseResult = parse(source);

  return (
    <div style={ {
      display: 'flex',
      flexDirection: 'row',
      padding: 20
    } }>
      <textarea
        value={ source }
        onChange={ e => setSource(e.target.value) }
        style={ {
          width: 600,
          padding: 8,
          fontFamily: 'monaco',
          fontSize: 16
        } }
      />
      <div style={{
        marginLeft: 20,
      }}>
        {
          parseResult.status === 'succeeded' ? (
          <Graph
            layout={ layout(parseResult.model) }
            onNodeChange={ ({ patchRequest }) => {
              setSource(patch(source, patchRequest, parseResult.sourceMap));
            }}
          />
        ) : (
          <div>parse error</div>
        )}
      </div>
    </div>
  )
}
