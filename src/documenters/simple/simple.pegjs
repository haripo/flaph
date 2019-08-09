nodes
  = nodes:node* { return nodes; }

node
  = ws id:id ws ":" ws param:parameters ws { return { id, ...param } }

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

id
  = special_id
  / string

special_id
  = "@" string "." string { return text() }

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

special_id_head
  = "@"

string
  = chars:[a-zA-Z0-9_\-,]+ { return chars.join('') }

ws
  = [ \t\n\r]*