import filters from './filter/index.js';
import {eitherWordPattern, safeReplace} from './regex.js';

const pronounTypes = ['nominativeSubject', 'obliqueObject', 'possessiveDeterminer', 'possessivePronoun', 'reflexive'];

/**
 * Represents a configured gender-fluidisation instace.
 * @constructor
 * @param {string} filtrateSetKey - Pronoun set to fluidize to
 * @param {list} residueSetKeys - Pronoun.sets to fluidize
 * @param {string} locale - The locale (language). ISO 639-1 2 letter code - PRs welcome for new languages
 */
module.exports = class GenderFluid {
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
     * fluidize gender specific nominative subjects
     *
     * example: He/She laughed
     *
     * @param {String} text
     */
    fluidizeNominativeSubjects = (text) => {
        return new Promise((resolve) => {
            var filtrate = this.filtrates.nominativeSubject;
            var fluidizedText = safeReplace(text, this.patterns.nominativeSubject, filtrate);
            var past = new RegExp(`\\b(${filtrate}) was\\b`, 'gi');
            var present = new RegExp(`\\b(${filtrate}) is\\b`, 'gi');
            fluidizedText = fluidizedText.replace(past, '$1 were');
            fluidizedText = fluidizedText.replace(present, '$1 are');
            resolve(fluidizedText);
        });
    }

    /**
     * fluidize gender specific oblique objects
     *
     * example: I called him/her
     *
     * @param {String} text
     */
    fluidizeObliqueObjects = (text) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.obliqueObject, this.filtrates.obliqueObject);
            resolve(fluidizedText);
        });
    }

    /**
     * fluidize gender specific possessive determiners
     *
     * example: His/Her eyes gleam
     *
     * @param {String} text
     */
    fluidizePossessiveDeterminers = (text) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.possessiveDeterminer, this.filtrates.possessiveDeterminer);
            resolve(fluidizedText);
        });
    }

    /**
     * fluidize gender specific possessive pronouns
     *
     * example: That is his/hers
     *
     * @param {String} text
     */
    fluidizePossessivePronouns = (text) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.possessivePronoun, this.filtrates.possessivePronoun);
            resolve(fluidizedText);
        });
    }

    /**
     * fluidize gender specific reflexives
     *
     * example: He/She likes himself/herself
     *
     * @param {String} text
     */
    fluidizeReflexives = (text) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.reflexive, this.filtrates.reflexive);
            resolve(fluidizedText);
        });
    }

    /**
     * fluidize gender specific pronouns
     *
     * @param {String} text
     */
    fluidize = (text) => {
        return this.fluidizeNominativeSubjects(text)
            .then(intermediateText => {
                return this.fluidizeObliqueObjects(intermediateText);
            })
            .then(intermediateText => {
                return this.fluidizePossessiveDeterminers(intermediateText);
            })
            .then(intermediateText => {
                return this.fluidizePossessivePronouns(intermediateText);
            })
            .then(intermediateText => {
                return this.fluidizeReflexives(intermediateText);
            });
    }
};

