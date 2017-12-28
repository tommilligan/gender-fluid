// @flow

import en from './en.js';

export type genderFilter = Map<string, string|string[]>;
export type localFilters = Map<string, genderFilter>;
export type globalFilters = Map<locales, localFilters>;

var filters: globalFilters = new Map([
    ['en', en]
]);
export default filters;