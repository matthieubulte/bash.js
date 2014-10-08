var Stream = require('../lib/stream.js');

describe('Stream', function() {
    
    describe('next()', function() {
        it('can return the next element of the stream', function() {
            // setup
            var stream = new Stream([1, 2, 3]);

            // when
            var first  = stream.next();
            var second = stream.next();
            var third  = stream.next();

            // then
            expect(first).toEqual(1);
            expect(second).toEqual(2);
            expect(third).toEqual(3);
        });
    });
    
    
});
