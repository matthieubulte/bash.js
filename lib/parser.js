if(typeof(require) !== 'undefined') {
    var types = require('../lib/types.js');
    var Token = types.Token;
    var Tree = types.Tree;
}

var T = Token.Type;
/**
 * Build an AST out of a valid array of tokens.
 *
 * @param {Array.<Token>} tokens - array of tokens to parse
 * @return {Tree}
 */
function parse(tokens) {
    if(!tokens || tokens.length === 0) {
        return new Tree();
    }

    /**
     * @param {Token} token
     * @return {Tree.Leaf}
     */
    function token_to_leaf(token) {
        return new Tree.Leaf(token.type, token.value);
    }

    /**
     * @param {number} start - index of the first token of the expression
     * @return {number} index of the last token of the expression
     */
    function find_matching(start) {
        var nested = 1;

        for(var i = start; i<tokens.length; i++) {
            var c = tokens[i].type;

            if(c === T.L_PAR) {
                nested++;
            }
            
            else if (c === T.R_PAR) {
                if(--nested === 0) {
                    return i;
                }
            }
        }

        throw new Error('unbalanced parenthesis');
    }

    var root = new Tree();

    for(var i = 0; i<tokens.length; i++) {
        var t = tokens[i];

        if(t.type === T.EOF) {
            break;
        }

        if(t.type === T.R_PAR) {
            throw new Error('unexpected right parenthesis');
        }

        if(t.type === T.PIPE) {
            var left = root;
            var right = parse(tokens.slice(i+1));

            root = new Tree(Tree.Type.PIPE);
            root.addChild(left);
            root.addChild(right);

            break;
        }

        if(t.type === T.L_PAR) {
            var expression_end = find_matching(i+1);
            var expression_tokens = tokens.slice(i+1, expression_end);

            root.addChild(parse(expression_tokens));
            i = expression_end;

            continue;
        }
        
        root.addChild(token_to_leaf(t));
    }

    return root;
}

if(typeof(require) !== 'undefined') {
    module.exports = parse;
}
