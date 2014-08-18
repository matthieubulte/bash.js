if(typeof(module) !== 'undefined') {
    var parse = require('../lib/parser');
    var tokenize = require('../lib/tokenizer.js');
    var types = require('../lib/types.js');
}

/**
 * @constructor
 */
function Core() {

    /** @type {Array.<*>} */
    this.retStask = [];

    /** @dict */
    this.commands = {};

    this.commands['id'] = function(x) {
        return x; 
    };
}

Core.prototype._runJs = function(code) {
    return (function(_) {
        return eval(code);
    })(this.retStack[this.retStack.length-1]);
};

/**
 * @param {Tree} tree
 * @return {*}
 */
Core.prototype._runCommand = function(tree) {
    var commandName = tree.children[0].value;
    var command = this.commands[commandName];

    var core = this;
    var args = tree.children.slice(1) // remove command name
        .map(function(arg) {
            return core._run(arg);
        });

    return command.apply(null, args);
};


/**
 * @param {Tree} tree
 * @return {*}
 */
Core.prototype._runExpression = function(tree) {
    // determine if it's a command we're trying to run
    var firstChild = tree.children[0];

    if(firstChild instanceof types.Tree.Leaf &&
       firstChild.type === types.Tree.Leaf.Type.SYM &&
       this.commands[firstChild.value] !== undefined) {
           return this._runCommand(tree);
    }

    else {
        var flat = tree.flatten();
        var asString = flat.join(' ');

        return this._runJs(asString);
    }
};


/**
 * @param {Tree} tree
 * @return {*}
 */
Core.prototype._runPipe = function(tree) {
    var left = tree.children[0];
    var right = tree.children[1];

    var left_ret = this._run(left);

    this.retStack.push(left_ret);
    var right_ret = this._run(right);
    this.retStask.pop();

    return right_ret;
};

/**
 * @param {Tree} tree
 * @return {*}
 */
Core.prototype._runTree = function(tree) {
    if(tree.children.length === 0) return null;

    if(tree.type === types.Tree.Type.EXPR) {
        return this._runExpression(tree);
    }
    else {
        return this._runPipe(tree);
    }
};

/**
 * @param {Tree.Leaf} leaf
 * @return {*}
 */
Core.prototype._runLeaf = function(leaf) {
    if(leaf.type === types.Tree.Leaf.Type.SYM) {
        return this._runJs(leaf.value);
    }
    else {
        return leaf.value;
    }
};


/**
 * @param {Tree|Tree.Leaf} node
 * @return {*}
 */
Core.prototype._run = function(node) {
    if(node instanceof types.Tree.Leaf) {
        return this._runLeaf(node);
    }
    else {
        return this._runTree(node);
    }
};

/**
 *
 * @param {string} code - code snipper to run
 * @return {*} result
 */
Core.prototype.run = function(code) {
    var tokens = tokenize(code);
    var ast = parse(tokens);

    this.retStack = [];
    return this._run(ast); 
};

if(typeof(module) !== 'undefined') {
    module.exports = Core;
}
