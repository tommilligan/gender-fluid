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
        var patterns = {};
        const local = filters[this.locale];

        if (local === undefined) {
            throw new Error(`Unknown locale '${this.locale}`);
        }

        pronounTypes.map(pronounType => {
            var residues = this.residueSetKeys.map(residueSetKey => {
                try {
                    return local[residueSetKey][pronounType];
                } catch (ex) {
                    throw new Error(`Could not load '${pronounType}' from set '${residueSetKey}'`);
                }
            });
            patterns[pronounType] = eitherWordPattern(residues);
        });
        return patterns;
    }

    /**
     * Strings to replace in text
     */
    generateFiltrates = () => {
        var filtrates = {};
        pronounTypes.map(pronounType => {
            const local = filters[this.locale];
            try {
                filtrates[pronounType] = local[this.filtrateSetKey][pronounType];
            } catch (ex) {
                throw new Error(`Could not load '${pronounType}' from set '${this.filtrateSetKey}'`);
            }
        });
        return filtrates;
    }

    /**
     * neutralize gender specific nominative subjects
     *
     * example: He/She laughed
     *
     * @param {String} text
     */
    neutralizeNominativeSubjects = (text) => {
        return new Promise((resolve) => {
            var filtrate = this.filtrates.nominativeSubject;
            var neutralizedText = safeReplace(text, this.patterns.nominativeSubject, filtrate);
            var past = new RegExp(`\\b(${filtrate}) was\\b`, 'gi');
            var present = new RegExp(`\\b(${filtrate}) is\\b`, 'gi');
            neutralizedText = neutralizedText.replace(past, '$1 were');
            neutralizedText = neutralizedText.replace(present, '$1 are');
            resolve(neutralizedText);
        });
    }

    /**
     * neutralize gender specific oblique objects
     *
     * example: I called him/her
     *
     * @param {String} text
     */
    neutralizeObliqueObjects = (text) => {
        return new Promise((resolve) => {
            var neutralizedText = safeReplace(text, this.patterns.obliqueObject, this.filtrates.obliqueObject);
            resolve(neutralizedText);
        });
    }

    /**
     * neutralize gender specific possessive determiners
     *
     * example: His/Her eyes gleam
     *
     * @param {String} text
     */
    neutralizePossessiveDeterminers = (text) => {
        return new Promise((resolve) => {
            var neutralizedText = safeReplace(text, this.patterns.possessiveDeterminer, this.filtrates.possessiveDeterminer);
            resolve(neutralizedText);
        });
    }

    /**
     * neutralize gender specific possessive pronouns
     *
     * example: That is his/hers
     *
     * @param {String} text
     */
    neutralizePossessivePronouns = (text) => {
        return new Promise((resolve) => {
            var neutralizedText = safeReplace(text, this.patterns.possessivePronoun, this.filtrates.possessivePronoun);
            resolve(neutralizedText);
        });
    }

    /**
     * neutralize gender specific reflexives
     *
     * example: He/She likes himself/herself
     *
     * @param {String} text
     */
    neutralizeReflexives = (text) => {
        return new Promise((resolve) => {
            var neutralizedText = safeReplace(text, this.patterns.reflexive, this.filtrates.reflexive);
            resolve(neutralizedText);
        });
    }

    /**
     * neutralize gender specific pronouns
     *
     * @param {String} text
     */
    neutralize = (text) => {
        return this.neutralizeNominativeSubjects(text)
            .then(intermediateText => {
                return this.neutralizeObliqueObjects(intermediateText);
            })
            .then(intermediateText => {
                return this.neutralizePossessiveDeterminers(intermediateText);
            })
            .then(intermediateText => {
                return this.neutralizePossessivePronouns(intermediateText);
            })
            .then(intermediateText => {
                return this.neutralizeReflexives(intermediateText);
            });
    }
};

