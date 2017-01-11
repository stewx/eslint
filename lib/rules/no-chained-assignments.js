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
 * Iterate through text to find previous "=" operator token
 *
 * @param {SourceCode} sourceCode Source code object provided by ESLint
 * @param {ASTNode} node Node for which to find previous operator token
 * @returns {Token} previous operator token
 */
function getPreviousOperator(sourceCode, node) {
    let token = sourceCode.getTokenBefore(node);

    while (token && token.value !== "=") {
        token = sourceCode.getTokenBefore(token);
    }

    return token;
}

/**
 * Iterate through text to find next operator "=" token
 *
 * @param {SourceCode} sourceCode Source code object provided by ESLint
 * @param {ASTNode} node Node for which to find previous operator token
 * @returns {Token} next operator token
 */
function getNextOperator(sourceCode, node) {
    let token = sourceCode.getTokenAfter(node);

    while (token && token.value !== "=") {
        token = sourceCode.getTokenAfter(token);
    }

    return token;
}

/**
 * Traverse up tree to find parent statement of node
 * @param {SourceCode} sourceCode Source code object provided by ESLint
 * @param {fixer} fixer Fixer object provided by ESLint
 * @param {ASTNode} node Node to split into multiple statements
 * @returns {Object} Fixer retturn object
 */
function splitChainedAssignment(sourceCode, fixer, node) {
    const fullText = sourceCode.getText();
    const statement = getStatement(node);
    const leftSide = node.left;
    const rightSide = getRightSide(node);

    // Get text for rightmost node, which will be used in new line created
    const prevOperator = getPreviousOperator(sourceCode, rightSide);
    const firstToken = sourceCode.getTokenAfter(prevOperator);
    const rightText = fullText.slice(firstToken.start, statement.end);

    // Get operator text, such as " = " or "="
    const operatorToken = getNextOperator(sourceCode, leftSide);
    const textBeforeOperatorToken = fullText.slice(sourceCode.getTokenBefore(operatorToken).end, operatorToken.start);
    const textAfterOperator = fullText.slice(operatorToken.end, sourceCode.getTokenAfter(operatorToken).start);
    const operatorText = textBeforeOperatorToken + sourceCode.getText(operatorToken) + textAfterOperator;

    // Get segment of original source text that will not be replaced
    const remainderText = fullText.slice(sourceCode.getTokenAfter(operatorToken).start, statement.end);

    // Get new line of generated code to append
    const newLine = sourceCode.getText(leftSide) + operatorText + rightText;

    const replacementText = `${remainderText}\n${newLine}`;

    const operatorBeforeLeftSide = getPreviousOperator(sourceCode, leftSide);
    const firstTokenOfLeftSide = sourceCode.getTokenAfter(operatorBeforeLeftSide);

    return fixer.replaceTextRange([firstTokenOfLeftSide.start, statement.end], replacementText);
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
                if (["AssignmentExpression", "VariableDeclarator"].indexOf(node.parent.type) !== -1) {
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
