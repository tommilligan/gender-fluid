module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 6
    },
    "rules": {
        "strict": 0,
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "allowTemplateLiterals": 0,
        "semi": [
            "error",
            "always"
        ]
    },
    "plugins": [
        "mocha"
    ],
};