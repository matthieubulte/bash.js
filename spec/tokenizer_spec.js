var tokenize = require('../lib/tokenizer.js');
var Token = require('../lib/types.js').Token;
var T = Token.Type;

function random_string(max) {
    max = max || 1000;

    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()|';
    var text = '';
    var len = Math.floor(Math.random() * max);

     while(len--) {
        text += alphabet[Math.floor(Math.random() * alphabet.length)];
     }

     return text;
}

function ensure_array(x) {
    if(!Array.isArray(x)) {
        x = [x];
    }
    return x;
}

function expect_tokens_match(actual_tokens, expected_tokens) {
    actual_tokens = ensure_array(actual_tokens);
    expected_tokens = ensure_array(expected_tokens);

    for (var i = 0; i < expected_tokens.length; i++) {
        var expected = expected_tokens[i];
        var actual = actual_tokens[i];

        if(expected.type) {
            expect(actual.type).toEqual(expected.type);
            expect(actual.value).toEqual(expected.value);
        }
        else {
            expect(actual.type).toEqual(expected);
        }
    }
}

function token(type, value) {
    return {
        type: type,
        value: value
    };
}

function tokens() {
    var toks = Array.prototype.slice.call(arguments);
    return toks.concat(T.EOF);
}

describe('tokenizer', function () {    
    it('should always end with EOF', function() {
        var input = random_string();
        
        var output = tokenize(input);
        var last = output[output.length - 1];

        expect_tokens_match(last, T.EOF);
    });

    it('should tokenize the "|" input.', function () {
        var input = '|';
        var expected = tokens(T.PIPE);

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should tokenize the "(" input', function () {
        var input = '(';
        var expected = tokens(T.L_PAR);

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should tokenize the ")" input', function () {
        var input = ')';
        var expected = tokens(T.R_PAR);

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should tokenize a symbol', function () {
        var input = 'symbol';
        var expected = tokens(token(T.SYM, 'symbol'));

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should throw an "unclosed string" error if receiving an unclosed string', function() {
       var input = '"bla';
       
       expect(function() {
            tokenize(input);
       }).toThrow('unclosed string');
    }); 

    it('should tokenize a double quoted string', function () {
        var str = 'toast';
        var input = '"' + str + '"';
        var expected = tokens(token(T.STR, str));

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should tokenize a single quoted string', function () {
        var str = 'bread';
        var input = "'" + str + "'";
        var expected = tokens(token(T.STR, str));
        
        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

    it('should tokenize string containing quote', function() {
        var str = "doesn't fail";
        var input = '"' + str + '"';
        var expected = tokens(token(T.STR, str));

        var output = tokenize(input);

        expect_tokens_match(output, expected);
    });

});
