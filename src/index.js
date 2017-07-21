import filters from './filter/index.js';

var residueSetsRegexString = (residueSets) => {
    return`\b(${residueSets.join('|')})\b`
}

/**
 * Represents a configured gender-neutralisation instace.
 * @constructor
 * @param {string} filtrateSet - Pronoun set to nuetralize to
 * @param {list} residueSets - Pronoun.sets to neutralize
 * @param {string} locale - The locale (language). ISO 639-1 2 letter code - PRs welcome for new languages
 */
module.exports = class Gender {
    constructor (filtrateSet = 'they', residueSets = ['him', 'her'], locale = 'en') {
        this.locale = locale;
        this.filtrateSet = filtrateSet;
        this.residueSets = residueSets;

        this.patterns = this.generatePatterns();
    }

    /**
     * specific gender neutral patterns
     *
     * @var {Object}
     * @name patterns
     */
    generatePatterns () {
        var patterns = {}
        const pronounTypes = ['nominativeSubject', 'obliqueObject', 'possessiveDeterminer', 'possessivePronoun', 'reflexive'];
        pronounTypes.map(pronounType => {
            const local = filters[this.locale];
            var residues = residueSets.map(residueSet => {
                return local[residueSet][pronounType];
            })
            patterns[pronounType] = residueSetsRegexString(residues);
        })
        return patterns;
    }

    /**
     * perform a safe regexp replacement that preserves capitalization
     *
     * @param {String} text
     * @param {RegExp} find
     * @param {String} replace
     */
    safeReplace = (text, find, replace) => {

        text = text.replace(find, function(match, specific){
            if (/[A-Z]/.test(specific.substring(0, 1))){
                return replace.charAt(0).toUpperCase() + replace.substring(1);
            }
            return replace;
        });
        return text;
    }

    /**
     * neutralize gender specific nominative subjects
     *
     * example: He/She laughed
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizeNominativeSubjects = (text, callback) => {
        var filter, past, present;

        // terms
        filter = (arguments > 2 && filters[arguments[2]] !== undefined) ? arguments[2] : 'they';
        text = this.safeReplace(text, this.patterns.nominativeSubject, this.filters[filter].nominativeSubject);

        // tense
        past = new RegExp('\\b(' + this.filters[filter].nominativeSubject + ') +was\\b', 'i');
        present = new RegExp('\\b(' + this.filters[filter].nominativeSubject + ') +is\\b', 'i');
        text = text.replace(past, '$1 were');
        text = text.replace(present, '$1 are');

        // finish
        callback(undefined, text);
    }

    /**
     * neutralize gender specific oblique objects
     *
     * example: I called him/her
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizeObliqueObjects = (text, callback) => {

        var filter;

        // terms
        filter = (arguments > 2 && filters[arguments[2]] !== undefined) ? arguments[2] : 'they';
        text = this.safeReplace(text, this.patterns.obliqueObject, this.filters[filter].obliqueObject);

        // finish
        callback(undefined, text);

    }

    /**
     * neutralize gender specific possessive determiners
     *
     * example: His/Her eyes gleam
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizePossessiveDeterminers = (text, callback) => {

        var filter;

        // terms
        filter = (arguments > 2 && filters[arguments[2]] !== undefined) ? arguments[2] : 'they';
        text = this.safeReplace(text, this.patterns.possessiveDeterminer, this.filters[filter].possessiveDeterminer);

        // finish
        callback(undefined, text);

    }

    /**
     * neutralize gender specific possessive pronouns
     *
     * example: That is his/hers
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizePossessivePronouns = (text, callback) => {

        var filter;

        // terms
        filter = (arguments > 2 && filters[arguments[2]] !== undefined) ? arguments[2] : 'they';
        text = this.safeReplace(text, this.patterns.possessivePronoun, this.filters[filter].possessivePronoun);

        // finish
        callback(undefined, text);

    }

    /**
     * neutralize gender specific reflexives
     *
     * example: He/She likes himself/herself
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizeReflexives = (text, callback) => {

        var filter;

        // terms
        filter = (arguments > 2 && filters[arguments[2]] !== undefined) ? arguments[2] : 'they';
        text = this.safeReplace(text, this.patterns.reflexive, this.filters[filter].reflexive);

        // finish
        callback(undefined, text);

    }

    /**
     * neutralize gender specific pronouns
     *
     * @param {String} text
     * @param {Function} callback({String} err, {String} text)
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralize = (text, filter = 'they') => {
        return this.neutralizeNominativeSubjects(text)
            .then(text => {
                return this.neutralizeObliqueObjects(text);
            })
            .then(text => {
                return this.neutralizePossessiveDeterminers(text);
            })
            .then(text => {
                return this.neutralizePossessivePronouns(text);
            })
            .then(text => {
                return this.neutralizeReflexives(text, callback);
            });
    }
};

