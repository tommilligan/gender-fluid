
# gender-fluid

[![npm](https://img.shields.io/npm/v/gender-fluid.svg)](https://www.npmjs.com/package/gender-fluid)
[![license](https://img.shields.io/github/license/tommilligan/gender-fluid.svg)]()

[![Travis branch](https://img.shields.io/travis/tommilligan/gender-fluid/develop.svg)](https://travis-ci.org/tommilligan/gender-fluid)
[![codecov](https://codecov.io/gh/tommilligan/gender-fluid/branch/develop/graph/badge.svg)](https://codecov.io/gh/tommilligan/gender-fluid)
[![David](https://img.shields.io/david/tommilligan/gender-fluid.svg)](https://david-dm.org/tommilligan/gender-fluid)

A node module that fluidizes gender specific text.

## Install

```bash
yarn add gender-fluid
```

## Usage

```javascript
var GenderFluid = require('gender-fluid');

// setup configuration
var gender = new GenderFluid()

// defaults are
var gender = new GenderFluid(
    'they',           // form to fluidize to
    ['he', 'she'],    // forms to fluidize from
    'en'              // locale
)

// let's fluidize some gender specific content
// ES6 syntax
var specific = 'I called him on Wednesday to tell him the good news.';
gender.fluidize(specific)
    .then(fluid => {
        console.log(fluid)  // I called them on Wednesday to tell them the good news.
    });
```

Conversion is possible in any direction (although quality of grammer will vary).
```javascript
// vanilla syntax
var specific = 'He should talk to them about feminism.';
var gender = new GenderFluid('she', ['he', 'they']);
gender.fluidize(specific)
    .then(function(fluid) {
        console.log(fluid)  // She should talk to her about feminism.
    });
```

## Supported Filters

##### English (`en`)

| | nominative<br/>(subject) | oblique<br/>(object) | possessive<br/>determiner | possessive<br/>pronoun | reflexive | generic | honorific | junior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|`he` | he | him | his | his | himself | man | mr | boy |
|`she` | she | her | her | hers | herself | woman | ms, mrs, miss | girl |
|`they` | they | them | their | theirs | themself | person | mx | child |
|`e` | e | em | eir | eirs | eirself | person | mx | child |
|`ey` | ey | em | eir | eirs | emself | person | mx | child |
|`tho` | tho | thor | thors | thor | thongself | person | mx | child |
|`hu` | hu | hum | hus | hus | humself | person | mx | child |
|`per` | per | per | per | pers | perself | person | mx | child |
|`thon` | thon | thon | thons | thons | thonself | person | mx | child |
|`jee` | jee | jem | jeir | jeirs | jemself | person | mx | child |
|`ve` | ve | ver | vis | vis | verself | person | mx | child |
|`xe` | xe | xem | xyr | xyrs | xemself | person | mx | child |
|`ze` | ze | mer | zer | zers | zemself | person | mx | child |
|`zhe` | zhe | zhim | zher | zhers | zhimself | person | mx | child |

