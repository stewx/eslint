/**
 * @fileoverview Rule to check use of chained assignments
 * @author Stewart Rand
 */

"use strict";

/**
 * Get right-hand side of node
 *
 * @param {ASTNode} node Node for which to find right side
 * @returns {ASTNode} right side node
 */
function getRightSide(node) {
    if (node.right.type === "AssignmentExpression") {
        return getRightSide(node.right);
    } else {
        return node.right;
    }
}

/**
 * Traverse up tree to find parent statement of node
 *
 * @param {ASTNode} node Node for which to find parent statement
 * @returns {ASTNode} parent statement node
 */
function getStatement(node) {
    if (["ExpressionStatement", "VariableDeclaration"].indexOf(node.parent.type) !== -1) {
        return node.parent;
    } else {
        return getStatement(node.parent);
    }
}

/**
 * Traverse up tree to find parent statement of node
 * @param {SourceCode} sourceCode Source code object provided by ESLint
 * @param {fixer} fixer Fixer object provided by ESLint
 * @param {ASTNode} node Node to split into multiple statements
 * @returns {Object} Fixer retturn object
 */
function splitChainedAssignment(sourceCode, fixer, node) {

    // console.log("Splitting chained assignment\n");
    const rightSide = getRightSide(node);
    const statement = getStatement(node);
    const lineEnding = ";";
    const fullText = sourceCode.getText();
    const leftSide = node.left;

    // console.log("Current node:", sourceCode.getText(node));

    // Append new line with this node
    const operatorToken = sourceCode.getTokenAfter(leftSide);
    const textBeforeOperatorToken = fullText.slice(sourceCode.getTokenBefore(operatorToken).end, operatorToken.start);
    const textAfterOperator = fullText.slice(operatorToken.end, sourceCode.getTokenAfter(operatorToken).start);
    const operatorText = textBeforeOperatorToken + sourceCode.getText(operatorToken) + textAfterOperator;

    // console.log("Removing left side", leftSide);
    // fixer.remove(leftSide);
    // console.log("Removing operator", operatorToken);
    // fixer.remove(operatorToken);

    const fullRightSide = fullText.slice(sourceCode.getTokenAfter(operatorToken).start, statement.end);

    // console.log("Full right side:\"" + fullRightSide + "\"");
    const newLine = sourceCode.getText(leftSide) + operatorText + sourceCode.getText(rightSide) + lineEnding;

    // fixer.replaceText(node, flippedString);

    const replacementText = `${fullRightSide}\n${newLine}`;

    // console.log("Replacement text: \"" + replacementText + "\"");

    return fixer.replaceTextRange([leftSide.start, statement.end], replacementText);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow chaining of assignments",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [],

        fixable: "code"
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            AssignmentExpression(node) {
                if (node.parent.type === "AssignmentExpression") {
                    context.report({
                        node,
                        message: "Expected no chained assignments.",
                        fix(fixer) {
                            return splitChainedAssignment(sourceCode, fixer, node);
                        }
                    });
                }
            }
        };

    }
};
