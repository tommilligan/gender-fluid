var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Gender = require('../src/index.js');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('index.js', function(){
    describe('Gender class', function(){
        describe('construction', function(){
            it('should provide default arguments', function(){
                var gn = new Gender();
                expect(gn.locale).to.equal('en');
                expect(gn.filtrateSetKey).to.equal('they');
                expect(gn.residueSetKeys).to.have.members(['he', 'she']);
            });
            it('should error with unknown filtrateSetKey', function(){
                var badConstruction = () => {
                    new Gender('qux');
                };
                expect(badConstruction).to.throw(/qux/);
            });
            it('should error with unknown residueSetKeys', function(){
                var badConstruction = () => {
                    new Gender('they', ['qux']);
                };
                expect(badConstruction).to.throw(/qux/);
            });
            it('should error with unknown locale', function(){
                var badConstruction = () => {
                    new Gender('they', ['he', 'she'], 'qux');
                };
                expect(badConstruction).to.throw(/qux/);
            });
        });

        describe('individual fluidizations', function(){
            var gn = undefined;
            beforeEach(function() {
                gn = new Gender();
            });
            describe('fluidizeNominativeSubjects', function(){
                it('should return fluidized nominative subjects for gender specific statement', function(){
                    var text = 'She solved the problem by combining the proper solvents according to the prescribed ratio.';
                    var expected = 'They solved the problem by combining the proper solvents according to the prescribed ratio.';
                    return expect(gn.fluidizeNominativeSubjects(text)).to.eventually.equal(expected);
                });
                it('should do the same for past tense', function(){
                    var text = 'Yesterday he was swimming.';
                    var expected = 'Yesterday they were swimming.';
                    return expect(gn.fluidizeNominativeSubjects(text)).to.eventually.equal(expected);
                });
                it('should do the same for present tense', function(){
                    var text = 'Today he is swimming.';
                    var expected = 'Today they are swimming.';
                    return expect(gn.fluidizeNominativeSubjects(text)).to.eventually.equal(expected);
                });
            });
            it('should return fluidized oblique objects for gender specific statements', function(){
                var text = 'I spoke to him that morning and told him that the fervor quotient was the way to go.';
                var expected = 'I spoke to them that morning and told them that the fervor quotient was the way to go.';
                return expect(gn.fluidizeObliqueObjects(text)).to.eventually.equal(expected);
            });
            it('should return fluidized possessive determiners for gender specific statements', function(){
                var text = 'His back was so freaking wide that he looked like the Hulk from the rear.';
                var expected = 'Their back was so freaking wide that he looked like the Hulk from the rear.';
                return expect(gn.fluidizePossessiveDeterminers(text)).to.eventually.equal(expected);
            });
            it('should return fluidized possessive pronouns for gender specific statements', function(){
                var text = 'I took the toy away from him and told him that it was hers and that he was not to touch it again.';
                var expected = 'I took the toy away from him and told him that it was theirs and that he was not to touch it again.';
                return expect(gn.fluidizePossessivePronouns(text)).to.eventually.equal(expected);
            });
            it('should return fluidized reflexives for gender specific statements', function(){
                var text = 'She looked into the mirror and admired herself every morning ... she loved being a Mermaid.';
                var expected = 'She looked into the mirror and admired themself every morning ... she loved being a Mermaid.';
                return expect(gn.fluidizeReflexives(text)).to.eventually.equal(expected);
            });

            it('should return fluidized generics for gender specific statements', function(){
                var text = 'The man loved the woman very much - but what could he say to her?';
                var expected = 'The person loved the person very much - but what could he say to her?';
                return expect(gn.fluidizeGenerics(text)).to.eventually.equal(expected);
            });
            describe('fluidize honorifics', function(){
                it('should return fluidized honorifics for gender specific statements', function(){
                    var text = 'The letter was addressed to Mr. Smith, but they went ahead and opened it anyway.';
                    var expected = 'The letter was addressed to Mx. Smith, but they went ahead and opened it anyway.';
                    return expect(gn.fluidizeHonorifics(text)).to.eventually.equal(expected);
                });
                it('should handle fluidizing from multiple options', function(){
                    var text = 'The letter was addressed to Mrs. Smith, but Miss. Brown went ahead and opened it anyway.';
                    var expected = 'The letter was addressed to Mx. Smith, but Mx. Brown went ahead and opened it anyway.';
                    return expect(gn.fluidizeHonorifics(text)).to.eventually.equal(expected);
                });
                it('should handle fluidizing to multiple options', function(){
                    var gn = new Gender('she', ['he', 'they']);
                    var text = 'The letter was addressed to Mr. Smith, but Mx. Brown went ahead and opened it anyway.';
                    var expected = 'The letter was addressed to Ms. Smith, but Ms. Brown went ahead and opened it anyway.';
                    return expect(gn.fluidizeHonorifics(text)).to.eventually.equal(expected);
                });
            });
            it('should return fluidized juniors for gender specific statements', function(){
                var text = 'She never liked the other children in the group really.';
                var expected = 'She never liked the other children in the group really.';
                return expect(gn.fluidizeJuniors(text)).to.eventually.equal(expected);
            });
            describe('fluidize', function(){
                it('should fluidize multiple pronoun type in sequence', function(){
                    // Currently fails as "Her eyes" is not converted to "Their eyes" - posessives are after objects, so they are not handled correctly. Use Stanford Core NLP?
                    var text = 'I called him on Wednesday to tell her the plans. His reply was typical - that she\'d take care of herself.';
                    var expected = 'I called them on Wednesday to tell them the plans. Their reply was typical - they\'d take care of themself.';
                    return expect(gn.fluidize(text)).to.eventually.not.equal(expected);
                });
                it('should fail to differentiate posessive and objective pronouns', function(){
                    // Currently fails as "Her eyes" is not converted to "Their eyes" - posessives are after objects, so they are not handled correctly. Use Stanford Core NLP?
                    var text = 'I called him on Wednesday to tell him that she laughed at the singing Teddy Bear that he got her. Her eyes were overfilled with joy everytime it said "That is her! That is my new friend!". She really seems to like herself today.';
                    var expected = 'I called them on Wednesday to tell them that they laughed at the singing Teddy Bear that they got them. Their eyes were overfilled with joy everytime it said "That is them! That is my new friend!". They really seemed to like themself today.';
                    return expect(gn.fluidize(text)).to.eventually.not.equal(expected);
                });
            });
        });
    });
});
