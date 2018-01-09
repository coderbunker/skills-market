module.exports = {

    "extends": [
        "airbnb", 
        "plugin:jest/recommended"
      ],
      "env": {
        "node": true,
        "jest": true,
        "mocha": true
      },
      "parserOptions": {
        "ecmaVersion": 6
      },
      "globals": {
        "test": false,
        "expect": false,
        "describe": false,
        "it": false,
        "Promise": false
      },
      "rules": {
        "no-tabs": 0,
        "no-console": 0,
        "no-constant-condition": "off",
        "require-jsdoc": 0,
        "function-paren-newline": 0,
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "jest/valid-expect": "warn"
      }

};
