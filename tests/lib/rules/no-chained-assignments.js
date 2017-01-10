/**
 * @fileoverview Tests for no-chained-assignments rule.
 * @author Stewart Rand
 */
 /*jshint esversion: 6 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-chained-assignments"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Fixtures
//------------------------------------------------------------------------------

/**
 * Returns an error object at the specified line and column
 * @private
 * @param {int} line - line number
 * @param {int} column - column number
 * @returns {Oject} Error object
 */
function errorAt(line, column, type) {
    return {
        message: "Expected no chained assignments.",
        type,
        line,
        column
    };
}


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-chained-assignments", rule, {
    valid: [
        { code: "var a, b, c,\nd = 0;" },

        { code: "for(var a = 0, b = 0;;){}" },
        { code: "for(let a = 0, b = 0;;){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(const a = 0, b = 0;;){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(var a in obj){}" },
        { code: "for(let a in obj){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(const a in obj){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(var a of arr){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(let a of arr){}", parserOptions: { ecmaVersion: 6 } },
        { code: "for(const a of arr){}", parserOptions: { ecmaVersion: 6 } },

        { code: "export let a, b;", parserOptions: { sourceType: "module" } },
        { code: "export let a,\n b = 0;", parserOptions: { sourceType: "module" } }
    ],

    invalid: [
        { code: "var a = b = c = d;", errors: [errorAt(1, 9, "AssignmentExpression"), errorAt(1, 13, "AssignmentExpression")] },
        // { code: "let foo = bar = cee = 100;", parserOptions: { ecmaVersion: 6 } },
        // { code: "a = b = c " }

/*
        { code: "var a, b;", output: "var a, \nb;", options: ["always"], errors: [errorAt(1, 8)] },
        { code: "let a, b;", output: "let a, \nb;", options: ["always"], errors: [errorAt(1, 8)], parserOptions: { ecmaVersion: 6 } },
        { code: "var a, b = 0;", output: "var a, \nb = 0;", options: ["always"], errors: [errorAt(1, 8)] },
        { code: "var a = {\n foo: bar\n}, b;", output: "var a = {\n foo: bar\n}, \nb;", options: ["always"], errors: [errorAt(3, 4)] },
        { code: "var a\n=0, b;", output: "var a\n=0, \nb;", options: ["always"], errors: [errorAt(2, 5)] },
        { code: "let a, b = 0;", output: "let a, \nb = 0;", options: ["always"], errors: [errorAt(1, 8)], parserOptions: { ecmaVersion: 6 } },
        { code: "const a = 0, b = 0;", output: "const a = 0, \nb = 0;", options: ["always"], errors: [errorAt(1, 14)], parserOptions: { ecmaVersion: 6 } },

        { code: "var a, b, c = 0;", output: "var a, b, \nc = 0;", options: ["initializations"], errors: [errorAt(1, 11)] },
        { code: "var a, b,\nc = 0, d;", output: "var a, b,\nc = 0, \nd;", options: ["initializations"], errors: [errorAt(2, 8)] },
        { code: "var a, b,\nc = 0, d = 0;", output: "var a, b,\nc = 0, \nd = 0;", options: ["initializations"], errors: [errorAt(2, 8)] },
        { code: "var a\n=0, b = 0;", output: "var a\n=0, \nb = 0;", options: ["initializations"], errors: [errorAt(2, 5)] },
        { code: "var a = {\n foo: bar\n}, b;", output: "var a = {\n foo: bar\n}, \nb;", options: ["initializations"], errors: [errorAt(3, 4)] },

        { code: "for(var a = 0, b = 0;;){\nvar c,d;}", output: "for(var a = 0, b = 0;;){\nvar c,\nd;}", options: ["always"], errors: [errorAt(2, 7)] },
        { code: "export let a, b;", output: "export let a, \nb;", options: ["always"], errors: [errorAt(1, 15)], parserOptions: { sourceType: "module" } },
        { code: "export let a, b = 0;", output: "export let a, \nb = 0;", options: ["initializations"], errors: [errorAt(1, 15)], parserOptions: { sourceType: "module" } }
*/

    ]
});
