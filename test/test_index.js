var rewire = require('rewire')
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Gender = rewire('../src/index.js');

chai.use(chaiAsPromised)
var expect = chai.expect;

describe('index.js', function(){
    describe('construct new Gender', function(){
        it('should provide default arguments', function(){
            var gn = new Gender();
            expect(gn.locale).to.equal('en');
            expect(gn.filtrateSetKey).to.equal('they');
            expect(gn.residueSetKeys).to.have.members(['he', 'she']);
        });
        it('should error with unknown filtrateSetKey', function(){
            var badConstruction = () => {
                new Gender('qux')
            }
            expect(badConstruction).to.throw(/qux/)
        });
        it('should error with unknown residueSetKeys', function(){
            var badConstruction = () => {
                new Gender('they', ['qux'])
            }
            expect(badConstruction).to.throw(/qux/)
        });
        it('should error with unknown locale', function(){
            var badConstruction = () => {
                new Gender('they', ['he', 'she'], 'qux')
            }
            expect(badConstruction).to.throw(/qux/)
        });
    });

    describe('require("gender-neutral")', function(){
        var gn = undefined;
        beforeEach(function() {
            gn = new Gender()
        });
        describe('gender.neutralizeNominativeSubjects(text, callback, [type])', function(){
            it('should return neutralized nominative subjects for gender specific statement', function(done){
                var text = 'She solved the problem by combining the proper solvents according to the prescribed ratio.';
                var expected = 'They solved the problem by combining the proper solvents according to the prescribed ratio.';
                gender.neutralizeNominativeSubjects(text, function(err, neutral){
                    expect(neutral).to.equal(expected);
                    done();
                }, 'they');
            });
        });

        describe('gender.neutralizeObliqueObjects(text, callback, [type])', function(){
            it('should return neutralized oblique objects for gender specific statements', function(done){
                var text = 'I spoke to him that morning and told him that the fervor quotient was the way to go.';
                var expected = 'I spoke to them that morning and told them that the fervor quotient was the way to go.';
                return gn.neutralizeObliqueObjects(text).to.eventually.equal(expected);
            });
        });

        describe('gender.neutralizePossessiveDeterminers(text, callback, [type])', function(){
            it('should return neutralized possessive determiners for gender specific statements', function(done){
                var text = 'His back was so freaking wide that he looked like the Hulk from the rear.';
                var expected = 'Their back was so freaking wide that he looked like the Hulk from the rear.';
                gender.neutralizePossessiveDeterminers(text, function(err, neutral){
                    expect(neutral).to.equal(expected);
                    done();
                }, 'they');
            });
        });

        describe('gender.neutralizePossessivePronouns(text, callback, [type])', function(){
            it('should return neutralized possessive pronouns for gender specific statements', function(done){
                var text = 'I took the toy away from him and told him that it was hers and that he was not to touch it again.';
                var expected = 'I took the toy away from him and told him that it was theirs and that he was not to touch it again.';
                gender.neutralizePossessivePronouns(text, function(err, neutral){
                    expect(neutral).to.equal(expected);
                    done();
                }, 'they');
            });
        });

        describe('gender.neutralizeReflexives(text, callback, [type])', function(){
            it('should return neutralized reflexives for gender specific statements', function(done){
                var text = 'She looked into the mirror and admired herself every morning ... she loved being a Mermaid.';
                var expected = 'She looked into the mirror and admired themself every morning ... she loved being a Mermaid.';
                gender.neutralizeReflexives(text, function(err, neutral){
                    expect(neutral).to.equal(expected);
                    done();
                }, 'they');
            });
        });

        describe('gender.neutralize(text, callback, [type])', function(){
            it('should fail to differentiate posessive and objective pronouns', function(done){
                var text = 'I called him on Wednesday to tell him that she laughed at the singing Teddy Bear that he got her. Her eyes were overfilled with joy everytime it said "That is her! That is my new friend!". She really seems to like herself today.';
                var expected = 'I called them on Wednesday to tell them that they laughed at the singing Teddy Bear that they got them. Their eyes were overfilled with joy everytime it said "That is them! That is my new friend!". They really seemed to like themself today.'
                gender.neutralize(text, function(err, neutral){
                    // Currently fails as "Her eyes" is not converted to "Their eyes" - posessives are after objects, so they are not handled correctly. Use Stanford Core NLP?
                    expect(neutral).to.not.equal(expected);
                    done();
                }, 'they');
            });
        });

    });
});
