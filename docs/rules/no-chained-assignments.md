# Disallow Use of Chained Assignments (no-chained-assignments)

Chaining the assignment of variables can lead to unexpected results or be difficult to read.

```js
var a = 1,
    b = 2,
    c = 3,
    d = 4;

a = b = c = d;
```

## Rule Details

This rule disallows using multiple assignments within a single statement.

Examples of **incorrect** code for this rule:

```js
/*eslint no-chained-assignments: "error"*/

var a = b = c = 5;

let foo = bar = "baz";

var a =
    b =
    c;
```

Examples of **correct** code for this rule:

```js
/*eslint no-chained-assignments: "error"*/
var a = 5;
var b = 5;
var c = 5;

let foo = "baz";
let bar = "baz";

var a = c;
var b = c;
```

## Related Rules

* [max-statements-per-line](max-statements-per-line.md)