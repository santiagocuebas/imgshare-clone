
const RULES = {
	OFF: 'off',
	WARN: 'warn',
	ERROR: 'error'
};

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: 'standard',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		semi: [RULES.ERROR, 'always'],
		quotes: [RULES.ERROR, 'single'],
		indent: [RULES.ERROR, 'tab'],
		'no-tabs': RULES.OFF,
		'prefer-promise-reject-errors': RULES.OFF
	}
};
