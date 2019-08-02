import React, { useState } from 'react';
import Graph from './graph/Graph';
import { parse, patch } from '../documenters/simple';
import { layout } from '../designers/dagre';

const originalNodes = `
1: {
  body: jjjjj
  to: 2
}
2: {
  body: iiii
}
`;

export default function Main() {
  const [strNodes, setNodes] = useState(originalNodes);
  const parseResult = parse(strNodes);

  return (
    <div style={ {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%'
    } }>
      <textarea
        value={ strNodes }
        onChange={ e => setNodes(e.target.value) }
        style={ {
          width: 600,
          height: '100%'
        } }
      />
      {
        parseResult.status === 'succeeded' ? (
        <Graph
          layout={ layout(parseResult.model) }
          onNodeChange={ ({ patchRequest }) => {
            setNodes(patch(strNodes, patchRequest, parseResult.sourceMap));
          }}
        />
      ) : (
        <div>parse error</div>
      )}
    </div>
  )
}
