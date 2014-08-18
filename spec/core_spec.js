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
});
