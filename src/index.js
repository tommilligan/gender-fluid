// @flow

import globalFilters from './filter/index.js';
import type {genderFilter, localFilters} from './filter/index.js';
import {eitherWordPattern, safeReplace} from './regex.js';
import {requireMapKey} from './utils.js';

const pronounTypes = ['nominativeSubject', 'obliqueObject', 'possessiveDeterminer', 'possessivePronoun', 'reflexive', 'generic', 'honorific', 'junior'];

module.exports = class GenderFluid {
    locale: string;
    filtrateSetKey: string;
    residueSetKeys: string[];
    localFilters: localFilters;
    filtrateSet: genderFilter;
    mappings: [string, string][];
    
    constructor (filtrateSetKey: string = 'they', residueSetKeys: string[] = ['he', 'she'], locale: string = 'en') {
        this.locale = locale;
        this.filtrateSetKey = filtrateSetKey;
        this.residueSetKeys = residueSetKeys;

        this.localFilters = requireMapKey(globalFilters, this.locale, `Unknown locale '${this.locale}'`);
        this.filtrateSet = requireMapKey(this.localFilters, this.filtrateSetKey, `Unknown gender filter '${this.filtrateSetKey}'`);

        this.mappings = this.generateMappings();
    }

    

    generateMappings = (): [string, string][] => {

        const mappings = this.filtrateSet

        var filtrates = {};
        pronounTypes.map(pronounType => {
            const local = filters[this.locale];
            try {
                var filtrate = local[this.filtrateSetKey][pronounType];
            } catch (ex) {
                throw new Error(`Could not load '${pronounType}' from set '${this.filtrateSetKey}'`);
            }

            if (!(typeof filtrate === 'string' || filtrate instanceof String)) {
                filtrate = filtrate[0];
            }
            filtrates[pronounType] = filtrate;
        });
        return filtrates;

        return mappings;
    }

    // String regex patters to find
    generatePatterns = () => {
        var patterns = {};
        const local = filters[this.locale];

        if (local === undefined) {
            throw new Error(`Unknown locale '${this.locale}`);
        }

        pronounTypes.map(pronounType => {
            var lumpyResidues = this.residueSetKeys.map(residueSetKey => {
                try {
                    var residues = local[residueSetKey][pronounType];
                } catch (ex) {
                    throw new Error(`Could not load '${pronounType}' from set '${residueSetKey}'`);
                }

                // If there is just a single string, convert to an array
                if (typeof residues === 'string' || residues instanceof String) {
                    residues = [residues];
                }
                return residues;
            });
            var flatResidues = [].concat.apply([], lumpyResidues);
            patterns[pronounType] = eitherWordPattern(flatResidues);
        });
        return patterns;
    }

    // Strings to replace in text
    generateFiltrates = () => {
        var filtrates = {};
        pronounTypes.map(pronounType => {
            const local = filters[this.locale];
            try {
                var filtrate = local[this.filtrateSetKey][pronounType];
            } catch (ex) {
                throw new Error(`Could not load '${pronounType}' from set '${this.filtrateSetKey}'`);
            }

            if (!(typeof filtrate === 'string' || filtrate instanceof String)) {
                filtrate = filtrate[0];
            }
            filtrates[pronounType] = filtrate;
        });
        return filtrates;
    }

    // fluidize gender specific nominative subjects e.g. He/She laughed
    fluidizeNominativeSubjects = (text: string) => {
        return new Promise((resolve) => {
            var filtrate = this.filtrates.nominativeSubject;
            var fluidizedText = safeReplace(text, this.patterns.nominativeSubject, filtrate);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific oblique objects e.g. I called him/her
    fluidizeObliqueObjects = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.obliqueObject, this.filtrates.obliqueObject);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific possessive determiners e.g. His/Her eyes gleam
    fluidizePossessiveDeterminers = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.possessiveDeterminer, this.filtrates.possessiveDeterminer);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific possessive pronouns e.g. That is his/hers
    fluidizePossessivePronouns = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.possessivePronoun, this.filtrates.possessivePronoun);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific reflexives e.g. He/She likes himself/herself
    fluidizeReflexives = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.reflexive, this.filtrates.reflexive);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific generics e.g. Go and find a man/woman.
    fluidizeGenerics = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.generic, this.filtrates.generic);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific honorifics e.g. Good morning, Mr/Mrs/Miss/Ms Smith.
    fluidizeHonorifics = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.honorific, this.filtrates.honorific);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific junior generics e.g. Play with the boy/girl.
    fluidizeJuniors = (text: string) => {
        return new Promise((resolve) => {
            var fluidizedText = safeReplace(text, this.patterns.junior, this.filtrates.junior);
            resolve(fluidizedText);
        });
    }

    // fluidize gender specific pronouns
    fluidize = (text: string) => {
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
            })
            .then(intermediateText => {
                return this.fluidizeGenerics(intermediateText);
            })
            .then(intermediateText => {
                return this.fluidizeHonorifics(intermediateText);
            })
            .then(intermediateText => {
                return this.fluidizeJuniors(intermediateText);
            });
    }
};

