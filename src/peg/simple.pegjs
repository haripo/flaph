nodes
  = nodes:node* { return nodes; }

node
  = ws id:string ws ":" ws param:parameters ws { return { id, param } }

parameters
  = "{" p:parameter_pair* "}" { return Object.fromEntries(p) }

parameter_pair
  = ws key:string ws ":" ws value:value ws { return [key, value] }

key
  = string

value
  = string {
    return {
      value: text(),
      start: location().start.offset,
      end: location().end.offset
    }
  }

string
  = chars:[a-zA-Z0-9]+ { return chars.join('') }

ws
  = [ \t\n\r]*