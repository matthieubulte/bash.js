var Core = require('../lib/core.js');

describe('core', function() {

    var core;

    beforeEach(function() {
        core = new Core();
    });

    it('should be instanciable', function() {
        expect(core).toBeDefined();
    });

    it('should run simple javascript expressions', function() {
        var input = '1+1';
        var expected = 2;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should run the id command', function() {
        var input = 'id 1';
        var expected = 1;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should return the result of the last expression of pipe expressions', function() {
        var input = 'id 1 | id 2';
        var expected = 2;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should access the return of the last pipe expression return value using the "_" character in commands', function() {
        var input = 'id 1 | id _';
        var expected = 1;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should access the return of the last pipe expression return value using the "_" character in javascript', function() {
        var input = 'id 1 | _ + 2';
        var expected = 3;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should maintain _ values in nested pipes', function() {
        var input = 'id (id 2 | _ * 2) | _ + 3';
        var expected = 7;

        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should run user added commands', function() {
        var spy = jasmine.createSpy();
        
        core.addCommand('test', spy);
        core.run('test');

        expect(spy).toHaveBeenCalled();
    });

    it('should call custom command with runtime parameters', function() {
        var spy = jasmine.createSpy();

        core.addCommand('test', spy);
        core.run("test 1 2 'test'");

        expect(spy).toHaveBeenCalledWith(1, 2, 'test');
    });

    it('should call custom command with evaluated arguments', function() {
        var spy = jasmine.createSpy();

        core.addCommand('test', spy);
        core.run('test (1 + 1) (id 3 | _ + 1) "str"');

        expect(spy).toHaveBeenCalledWith(2, 4, 'str');
    });

    it('should run user added aliases', function() {
        var input = 'test';
        var expected = 3;

        core.addAlias('test', '1 + 2');
        var output = core.run(input);

        expect(output).toEqual(expected);
    });

    it('should pass arguments using variables $1, $2, ..., $n', function() {
        var input = 'test 1 2 3 4 5';
        var expected = 15;

        core.addAlias('test', '$1 + $2 + $3 + $4 + $5');
        var output = core.run(input);

        expect(output).toEqual(expected);
    });
});
