/**
 * Enum for the different token
 * types.
 *
 * @enum {string}
 */
var T = {
    EOF:   'EOF',   /* end of the tokens stream */
    STR:   'STR',   /* single|double quoted string */
    SYM:   'SYM',   /* non quoted word */
    L_PAR: 'L_PAR', /* left parenthesis '(' */
    R_PAR: 'R_PAR', /* right parenthesis ')' */
    PIPE:  'PIPE'   /* pipe character '|' */
};

if(typeof(module) !== 'undefined') {
    module.exports.TokenType = T;
}
