
/**
 * @struct
 * @constructor
 * @param {Token.Type} type
 * @param {string=} value
 */
function Token(type, value) {
    /** @type {Token.Type} */
    this.type = type;

    /** @type {string|undefined} */
    this.value = value;
}

/**
 * @enum {string}
 */
Token.Type = {
    EOF:   'EOF',   /* end of the tokens stream */
    STR:   'STR',   /* single|double quoted string */
    SYM:   'SYM',   /* non quoted word */
    L_PAR: 'L_PAR', /* left parenthesis '(' */
    R_PAR: 'R_PAR', /* right parenthesis ')' */
    PIPE:  'PIPE'   /* pipe character '|' */
};

/**
 * @constructor
 * @param {Tree.Type=} type - default type is expression
 */
function Tree(type) {
    /**
     * @type {Tree.Type}
     */
    this.type = type || Tree.Type.EXPR;

    /**
     * @type {Array.<Tree|Tree.Leaf>}
     */
    this.children = [];
}

/**
 * @enum {string}
 */
Tree.Type = {
    EXPR: 'EXPR', /* root or parenthesis-delimited expression with n-children */
    PIPE: 'PIPE'  /* pipe node with two children 'left' and 'right' */
};

/**
 * @constructor
 * @param {Tree.Leaf.Type} type - type of the leaf
 * @param {string} value - value of the leaf
 */
Tree.Leaf = function(type, value) {
    /** @type {Tree.Leaf.Type} */
    this.type = type;

    /** @type {string} */
    this.value = value;
};

/**
 * @return {Array.<string>}
 */
Tree.Leaf.prototype.flatten = function() {
    if(this.type === Tree.Leaf.Type.SYM) {
        return [this.value];
    }
    else {
        return ["'" + this.value + "'"];
    }
};

/**
 *
 * @param {Tree.Leaf} other
 * @return {boolean}
 */
Tree.Leaf.prototype.equals = function(other) {
    return other && other.type === this.type && other.value === this.value;
};

/**
 * @enum {string}
 */
Tree.Leaf.Type = {
    SYM: 'SYM', /* symbol */
    STR: 'STR'  /* string */
};

/**
 * @param {Tree|Tree.Leaf} child
 */
Tree.prototype.addChild = function(child) {
    this.children.push(child);
};

/**
 * @return {Array.<String>}
 */
Tree.prototype.flatten = function() {
    
    if(this.type === Tree.Type.EXPR) {
        var flat_children = this.children.reduce(function(arr, child) {
            return arr.concat(child.flatten());
        }, []);
    
        return ['('].concat(flat_children).concat([')']);
    }
    else {
        var flat_left = this.children[0].flatten();
        var flat_right = this.children[1].flatten();

        return flat_left.concat(['|']).concat(flat_right);
    }
};

/**
 * @param {Tree} other
 * @return {boolean}
 */
Tree.prototype.equals = function(other) {
    if(!other || 
       !other.children ||
       other.children.length !== this.children.length ||
       other.type !== this.type) {
        return false;
    }

    for(var i = 0; i<this.children.length; i++) {
        if(!this.children[i].equals(other.children[i])) {
            return false;
        }
    }

    return true;
};

if(typeof(require) !== 'undefined') {
    module.exports.Token = Token;
    module.exports.Tree = Tree;
}
