
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
// ES2015 syntax
var specific = 'He should talk to them about feminism.';
var gender = new GenderFluid('she', ['he', 'they']);
gender.fluidize(specific)
    .then(function(fluid){
        console.log(fluid)
    });
```

## Supported Filters

##### English (`en`)

| | nominative<br/>(subject) | oblique<br/>(object) | possessive<br/>determiner | possessive<br/>pronoun | reflexive |
| --- | --- | --- | --- | --- | --- |
|`he` | he | him | his | his | himself |
|`she` | she | her | her | hers | herself |
|`they` | they | them | their | theirs | themself |
|`e` | e | em | eir | eirs | eirself |
|`ey` | ey | em | eir | eirs | emself |
|`tho` | tho | thor | thors | thor | thongself |
|`hu` | hu | hum | hus | hus | humself |
|`per` | per | per | per | pers | perself |
|`thon` | thon | thon | thons | thons | thonself |
|`jee` | jee | jem | jeir | jeirs | jemself |
|`ve` | ve | ver | vis | vis | verself |
|`xe` | xe | xem | xyr | xyrs | xemself |
|`ze` | ze | mer | zer | zers | zemself |
|`zhe` | zhe | zhim | zher | zhers | zhimself |

