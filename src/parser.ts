import pegParser from './peg/simple.pegjs';

// class Tracer {
//   keyStack: string[] = [];
//   values: Map<string[], string> = new Map();

//   trace(event) {
//     if (event.type === 'rule.match') {
//       switch (event.rule) {
//         case 'key':
//           this.keyStack.push(event.result);
//           break;
//         case 'value':
//           const key = Object.assign([], this.keyStack);
//           this.values.set(key, event.result);
//           this.keyStack.pop();
//           break;
//         case 'end_object':
//           this.keyStack.pop();
//           break;
//       }
//       console.log(event);
//     }
//   }
// }

// let tracer = new Tracer();
// console.log(pegParser.parse('{"hoge": 1, "fuga": [{ piyo: "3333" }, {pp: 111}], pppp: 1234}', { tracer }));
console.log(pegParser.parse('hoge123:{ piyo: 1 } hogepiyo:{123:345 11:saa}'));
// console.log(tracer);

export function parse(text: string) {
  try {
    return {
      succeeded: true,
      result: pegParser.parse(text)
    };
  } catch (e) {
    console.error(e);
    return {
      succeeded: false,
      result: ''
    };
  }
}

// 3: {
//   body: "hooooooooooooook"
//   to: 4
// }