nodes
  = nodes:node* { return nodes; }

node
  = ws id:string ws ":" ws param:parameters ws { return { id, ...param } }

parameters
  = "{" p:parameter_pair* "}" {
    return {
      properties: Object.fromEntries(p.map(v => [v.key, v.value])),
      sourceMap: Object.fromEntries(p.map(v => [v.key, v.location]))
    }
  }

parameter_pair
  = ws key:key ws ":" ws value:value ws {
    return {
      key,
      value: value.text,
      location: value.location,
    }
  }

key
  = string

value
  = string {
    return {
      text: text(),
      location: {
        start: location().start.offset,
        end: location().end.offset
      }
    }
  }

string
  = chars:[a-zA-Z0-9]+ { return chars.join('') }

ws
  = [ \t\n\r]*