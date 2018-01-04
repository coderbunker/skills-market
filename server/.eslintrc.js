module.exports = {
    "extends": "eslint:recommended",
    
    "env": {
	    "node": true
    },

    "parserOptions": {
	    "ecmaVersion": 6
    },

    "rules": {
	    "indent": ["error", "tab"],
	    "no-console": 0,
	    "no-constant-condition": "off"
    },

    "overrides": [
        {
            "files": ["controllers/*.js", "parser/*.js", "test/*.js", "*.js"]
        }
    ]

};
