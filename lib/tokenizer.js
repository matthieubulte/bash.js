if(typeof(module) !== 'undefined') {
    var T = require('../lib/types.js').TokenType;
}

/**
 * Transforms an string to an array of tokens.
 *
 * @param {string} input - string to tokenize
 * @return {Array.<T | {type: T, value: string}>} array of tokens
 */
function tokenize(input) {
    input = input || '';

    var string_delimiters = ['"', "'"];
    var symbol_breakers = ['(', ')', '|', ' '];

    var break_table = {
        '(': T.L_PAR,
        ')': T.R_PAR,
        '|': T.PIPE
    };

    var tokens = [];
    var accumulator = '';
    var current_string_delimiter = '';

    /**
     * emit a token of a given type / value.
     *
     * @param {T} type - type of the emitted token
     * @param {string=} value - value of the token
     */
    function emit(type, value) {
        var token = {};
        token.type = type;
        if(value) {
            token.value = value;
        }

        tokens.push(token);
    }

    /**
     * flush the accumulator as a token
     * of a given type.
     *
     * @param {T} type - type of the emitted token
     */
    function flush(type) {
        // don't emit an empty symbol
        if(type !== T.SYM || accumulator) {
            emit(type, accumulator);
        }
        accumulator = '';
    }

    for(var i = 0; i<input.length; i++) {
        var c = input[i];

        // if we're in a string
        if(current_string_delimiter) {
            // emit it if we are at the closing quote
            if(c === current_string_delimiter) {
                flush(T.STR);
                current_string_delimiter = '';
            }

            // else grow the string
            else {
                accumulator += c;
            }
        }

        // emit the current symbol and start a string
        else if(string_delimiters.indexOf(c) !== -1) {
            flush(T.SYM);
            current_string_delimiter = c;
        }

        // emit the current symbol and the character
        // breaking the symbol if not a space
        else if(symbol_breakers.indexOf(c) !== -1) {
            flush(T.SYM);
            if(break_table[c]) {
                emit(break_table[c]);
            }
        }

        // grow the current symbol
        else {
            accumulator += c;
        }
    }

    if(current_string_delimiter) {
        throw new Error('unclosed string');
    }

    flush(T.SYM);
    emit(T.EOF);

    return tokens;
}

if(typeof(module) !== 'undefined') {
    module.exports = tokenize;
}
