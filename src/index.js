import filters from './filter/index.js';
import {eitherWordPattern, safeReplace} from './regex.js';

const pronounTypes = ['nominativeSubject', 'obliqueObject', 'possessiveDeterminer', 'possessivePronoun', 'reflexive'];

/**
 * Represents a configured gender-neutralisation instace.
 * @constructor
 * @param {string} filtrateSetKey - Pronoun set to nuetralize to
 * @param {list} residueSetKeys - Pronoun.sets to neutralize
 * @param {string} locale - The locale (language). ISO 639-1 2 letter code - PRs welcome for new languages
 */
module.exports = class Gender {
    constructor (filtrateSetKey = 'they', residueSetKeys = ['he', 'she'], locale = 'en') {
        this.locale = locale;
        this.filtrateSetKey = filtrateSetKey;
        this.residueSetKeys = residueSetKeys;

        this.patterns = this.generatePatterns();
        this.filtrates = this.generateFiltrates();
    }

    /**
     * String regex patters to find
     */
    generatePatterns = () => {
        var patterns = {}
        const local = filters[this.locale];

        if (local === undefined) {
            throw new Error(`Unknown locale '${this.locale}`)
        }

        pronounTypes.map(pronounType => {
            var residues = this.residueSetKeys.map(residueSetKey => {
                try {
                    return local[residueSetKey][pronounType];
                } catch (ex) {
                    throw new Error(`Could not load '${pronounType}' from set '${residueSetKey}'`);
                }
            })
            patterns[pronounType] = eitherWordPattern(residues);
        })
        return patterns;
    }

    /**
     * Strings to replace in text
     */
    generateFiltrates = () => {
        var filtrates = {}
        pronounTypes.map(pronounType => {
            const local = filters[this.locale];
            try {
                filtrates[pronounType] = local[this.filtrateSetKey][pronounType];
            } catch (ex) {
                throw new Error(`Could not load '${pronounType}' from set '${this.filtrateSetKey}'`);
            }
        })
        return filtrates;
    }

    /**
     * neutralize gender specific nominative subjects
     *
     * example: He/She laughed
     *
     * @param {String} text
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
     * @param {String} [filter=they] (they|e|ey|tho|hu|per|thon|jee|ve|xe|ze|zhe)
     */
    neutralizeObliqueObjects = (text) => {
        return new Promise((resolve, reject) => {
            const text = safeReplace(text, this.patterns.obliqueObject, this.filtrates.obliqueObject);
            resolve(text)
        });
    }

    /**
     * neutralize gender specific possessive determiners
     *
     * example: His/Her eyes gleam
     *
     * @param {String} text

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

