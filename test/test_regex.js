var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var regex = require('../src/regex.js');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('regex.js', function(){
    describe('eitherWordPattern', function(){
        it('should work for one word', function(){
            expect(regex.eitherWordPattern(['foo'])).to.equal('\\b(?:foo)\\b');
        });
        it('should work for multiple words', function(){
            expect(regex.eitherWordPattern(['foo', 'bar'])).to.equal('\\b(?:foo|bar)\\b');
        });
    });

    describe('safeReplace', function(){
        it('should replace lowercase with lowercase', function(){
            expect(regex.safeReplace('baz foo baz', 'foo', 'bar')).to.equal('baz bar baz');
        });
        it('should replace titlecase with titlecase', function(){
            expect(regex.safeReplace('baz Foo baz', 'foo', 'bar')).to.equal('baz Bar baz');
        });
        it('should replace uppercase with titlecase', function(){
            expect(regex.safeReplace('baz FOO baz', 'foo', 'bar')).to.equal('baz Bar baz');
        });
        it('should handle a mix of cases', function(){
            expect(regex.safeReplace('foo FOO Foo fOO', 'foo', 'bar')).to.equal('bar Bar Bar bar');
        });
        it('should handle uppercase on the first character', function(){
            expect(regex.safeReplace('Foo', 'foo', 'bar')).to.equal('Bar');
        });
    });
});
