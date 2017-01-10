/**
 * @fileoverview Rule to check use of chained assignments
 * @author Stewart Rand
 */
"use strict";

/**
 * Get right-hand side of node
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
 */
function getStatement(node) {
    if (node.parent.type === "ExpressionStatement") {
        return node.parent;
    } else {
       return getStatement(node.parent);
    }
}

function splitChainedAssignment(sourceCode, fixer, node) {
    console.log("Splitting chained assignment\n");
    const rightSide = getRightSide(node);
    const statement = getStatement(node);
    const lineEnding = ";";

    console.log("Current node:", sourceCode.getText(node));
    // console.log(node);
    var fullText = sourceCode.getText();

    const leftSide = node.left;

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
    console.log("Full right side:\"" + fullRightSide + "\"");
    const newLine = sourceCode.getText(leftSide) + operatorText + sourceCode.getText(rightSide) + lineEnding;

    // fixer.replaceText(node, flippedString);

    var replacementText = fullRightSide + '\n' + newLine;
    console.log("Replacement text: \"" + replacementText + "\"");

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
            AssignmentExpression: function(node) {
                // context.report(node, 'Found an assignment!');
                // console.log("Node:", node);
                if (node.parent.type === "AssignmentExpression") {
                  context.report({
                    node: node,
                    message: 'Expected no chained assignments.',
                    fix: function(fixer) {
                      return splitChainedAssignment(sourceCode, fixer, node);
                    }
                  });
                }
            }
        };

    }
};
