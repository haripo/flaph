import React, { useState } from 'react';
import Graph from './graph/Graph';
import { parse, patch } from '../documenters/simple';
// import { layout } from '../designers/dagre';
import { layout } from '../designers/cola';

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
`;

export default function Main() {
  const [source, setSource] = useState(defaultSource);
  const parseResult = parse(source);

  return (
    <div style={ {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
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
        flex: 1
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
