
# gender-neutral

[![npm](https://img.shields.io/npm/v/gender-neutral.svg)](https://www.npmjs.com/package/gender-neutral)
[![license](https://img.shields.io/github/license/tommilligan/gender-neutral.svg)]()

[![Travis branch](https://img.shields.io/travis/tommilligan/gender-neutral/develop.svg)](https://travis-ci.org/tommilligan/gender-neutral)
[![codecov](https://codecov.io/gh/tommilligan/gender-neutral/branch/develop/graph/badge.svg)](https://codecov.io/gh/tommilligan/gender-neutral)
[![David](https://img.shields.io/david/tommilligan/gender-neutral.svg)](https://david-dm.org/tommilligan/gender-neutral)

A node module that neutralizes gender specific text.

## Install

```bash
yarn add git+https://github.com/tommilligan/gender-neutral#develop
```

## Usage

```javascript
var Gender = require('gender-neutral');

// setup configuration
var gn = new Gender()

// defaults are
var gn = new Gender(
    'they',           // form to neutralize to
    ['he', 'she'],    // forms to neutralize from
    'en'              // locale
)

// let's neutralize some gender specific content
// ES6 syntax
var specific = 'I called him on Wednesday to tell him the good news.';
gn.neutralize(specific)
    .then(neutral => {
        console.log(neutral)  // I called them on Wednesday to tell them the good news.
    });
```

Conversion is possible in any direction (although quality of grammer will vary).
```javascript
// ES2015 syntax
var specific = 'He should talk to them about feminism.';
var gn = new Gender('she', ['he', 'they']);
gn.neutralize(specific)
    .then(function(neutral){
        console.log(neutral)
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

