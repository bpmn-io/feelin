# feelin

[![CI](https://github.com/nikku/feelin/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/feelin/actions/workflows/CI.yml)

A [DMN](https://www.omg.org/spec/DMN/) FEEL parser and interpreter written in JavaScript. [__:arrow_right: Try it out__](https://nikku.github.io/feel-playground).


## Usage

```javascript
import {
  unaryTest,
  evaluate
} from 'feelin';

// Evaluate expressions and get results with warnings
const result = evaluate("Mike's daughter.name", {
  'Mike\'s daughter.name': 'Lisa'
});

console.log(result.value); // "Lisa"
console.log(result.warnings); // []

// Unary tests also return structured results
const testResult = unaryTest('[1..end]', { '?': 1, end: 10 });
console.log(testResult.value); // true
console.log(testResult.warnings); // []

// Warnings are collected when evaluation encounters issues
const errorResult = evaluate('x + y', {});
console.log(errorResult.value); // null
console.log(errorResult.warnings);
// [
//   {
//     type: 'NO_VARIABLE_FOUND',
//     message: "Variable 'x' not found",
//     position: { from: 0, to: 1 }
//   },
//   {
//     type: 'NO_VARIABLE_FOUND',
//     message: "Variable 'y' not found",
//     position: { from: 4, to: 5 }
//   },
//   {
//     type: 'INVALID_TYPE',
//     message: "Invalid type combination for arithmetic operation: nil and nil",
//     position: { from: 0, to: 5 }
//   }
// ]

// More examples
evaluate('for a in [1, 2, 3] return a * 2'); // { value: [ 2, 4, 6 ], warnings: [] }

evaluate('every rate in rates() satisfies rate < 10', {
  rates() {
    return [ 10, 20 ];
  }
}); // { value: false, warnings: [] }
```

### API

Both `evaluate()` and `unaryTest()` now return structured results:

```typescript
{
  value: any,           // The evaluation result (or null if errors occurred)
  warnings: Warning[]   // Array of warnings collected during evaluation
}

interface Warning {
  type: 'NO_VARIABLE_FOUND' | 'NO_CONTEXT_ENTRY_FOUND' | 'NO_PROPERTY_FOUND' | 'NOT_COMPARABLE' | 'INVALID_TYPE' | 'NO_FUNCTION_FOUND' | 'FUNCTION_INVOCATION_FAILURE';
  message: string;
  position: {
    from: number;
    to: number;
  };
}
```

### Warning Types

Warning types are aligned with [Camunda FEEL Scala](https://github.com/camunda/feel-scala) `EvaluationFailureType`:

- **NO_VARIABLE_FOUND**: A variable referenced in the expression was not found in the context
- **NO_CONTEXT_ENTRY_FOUND**: A context entry was not found
- **NO_PROPERTY_FOUND**: A property was not found on an object
- **NOT_COMPARABLE**: Values cannot be compared (incompatible types)
- **INVALID_TYPE**: An operation received incompatible types (e.g., arithmetic on arrays, mismatched types)
- **NO_FUNCTION_FOUND**: Function not found or target is not a function
- **FUNCTION_INVOCATION_FAILURE**: Function invocation failed during execution


## Features

* [x] Recognizes full FEEL grammar
* [x] Context sensitive (incl. names with spaces)
* [x] Recovers on errors
* [x] Temporal types and operations
* [x] Built-in FEEL functions
* [ ] Full [DMN TCK](https://github.com/dmn-tck/tck) compliance (cf. [coverage](./docs/DMN_TCK.md))


## Build and Run

```sh
# build the library and run all tests
npm run all

# spin up for local development
npm run dev

# execute FEEL tests in DMN TCK
npm run tck
```


## Related

* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system
* [feel-playground](https://github.com/nikku/feel-playground) - Interactive playground to learn the FEEL language


## License

MIT
