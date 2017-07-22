
# gender-neutral

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
// defaults are the same as
var gn = new Gender(
    'they',             // form to neutralize to
    ['he', 'she'],    // form(s) to neutralize from
    'en'                // locale
)

// let's neutralize some gender specific content
var specific = 'I called him on Wednesday to tell him the good news.';
gn.neutralize(specific).then(neutral => console.log(neutral));
// I called them on Wednesday to tell them the good news.
```

## Supported Filters

##### English (`en`)

| | nominative<br/>(subject) | oblique<br/>(object) | possessive<br/>determiner | possessive<br/>pronoun | reflexive |
| --- | --- | --- | --- | --- | --- |
|`he` | him | his | his | his | himself |
|`she` | her | her | her | hers | herself |
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

