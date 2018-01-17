module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "warn",
      2
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "warn",
      "always"
    ],
    "no-unused-vars": [
      "warn"
    ],
    "no-console": [
      "off"
    ],
    "no-inner-declarations": [
      "off"
    ]
  }
};