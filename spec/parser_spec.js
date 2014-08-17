var tokenize = require('../lib/tokenizer.js');
var parse = require('../lib/parser.js');
var types = require('../lib/types.js');
var Token = types.Token;
var T = Token.Type;
var Tree = types.Tree;
var Leaf = Tree.Leaf;

describe('parser', function() {
    function leaf(x) {
        return new Leaf(Leaf.Type.SYM, x);
    }

    var a = leaf('a');
    var b = leaf('b');
    var c = leaf('c');
    var d = leaf('d');
    var e = leaf('e');
    
    it('returns an empty tree on empty input', function() {
        var input = tokenize('');
        var expected = new Tree();

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });

    it('should parse flat expressions', function() {
        var input = tokenize('a b c');
        
        var expected = new Tree();
        expected.addChild(a);
        expected.addChild(b);
        expected.addChild(c);
       
        var output = parse(input);
        
        expect(expected.equals(output)).toBe(true);
    });

    it('should parse pipe expressions', function() {
        var input = tokenize('a b | c');

        var left = new Tree();
        left.addChild(a);
        left.addChild(b);

        var right = new Tree();
        right.addChild(c);

        var expected = new Tree(Tree.Type.PIPE);
        expected.addChild(left);
        expected.addChild(right);

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });

    it('should parse multiple pipe expressions', function() {
        var input = tokenize('a | b c | d e');

        var t_de = new Tree();
        t_de.addChild(d);
        t_de.addChild(e);

        var t_bc = new Tree();
        t_bc.addChild(b);
        t_bc.addChild(c);

        var t_a = new Tree();
        t_a.addChild(a);

        var t_bcde = new Tree(Tree.Type.PIPE);
        t_bcde.addChild(t_bc);
        t_bcde.addChild(t_de);

        var expected = new Tree(Tree.Type.PIPE);
        expected.addChild(t_a);
        expected.addChild(t_bcde);

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });

    it('should parse parenthesis expressions', function(){
        var input = tokenize('a (b c)');

        var t_bc = new Tree();
        t_bc.addChild(b);
        t_bc.addChild(c);

        var expected = new Tree();
        expected.addChild(a);
        expected.addChild(t_bc);

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });
    
    it('should parse multiple nested expressions', function() {
        var input = tokenize('a (b (c) d) e');

        var t_c = new Tree();
        t_c.addChild(c);

        var t_bcd = new Tree();
        t_bcd.addChild(b);
        t_bcd.addChild(t_c);
        t_bcd.addChild(d);

        var expected = new Tree();
        expected.addChild(a);
        expected.addChild(t_bcd);
        expected.addChild(e);

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });

    it('should parse mixed expressions', function() {
        var input = tokenize('a | b (c | d) e');

        var left = new Tree();
        left.addChild(a);

        var t_c = new Tree();
        t_c.addChild(c);
        
        var t_d = new Tree();
        t_d.addChild(d);

        
        var t_cd = new Tree(Tree.Type.PIPE);
        t_cd.addChild(t_c);
        t_cd.addChild(t_d);

        var right = new Tree();
        right.addChild(b);
        right.addChild(t_cd);
        right.addChild(e);

        var expected = new Tree(Tree.Type.PIPE);
        expected.addChild(left);
        expected.addChild(right);

        var output = parse(input);

        expect(expected.equals(output)).toBe(true);
    });

    it('should throw an "unexpected right parenthesis" error if parenthesis are not balanced', function() {
        var input = tokenize(')');
        
        expect(function() {
            parse(input);
        }).toThrow('unexpected right parenthesis');
    });
    
    it('should throw an "unbalanced parenthesis" error if parenthesis are not balanced', function() {
        var input = tokenize("( ( )");
        
        expect(function() {
            parse(input);
        }).toThrow('unbalanced parenthesis');
    });
});
