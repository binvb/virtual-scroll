module.exports = {
	extends: [
		'alloy',
		'alloy/typescript',
		'alloy/vue',
	],
	env: {
		browser: true,
	},
	parser: "vue-eslint-parser",
	parserOptions: {
			parser: {
					"js": "espree",
					"ts": "@typescript-eslint/parser",
					"<template>": "espree",
			}
	},
	globals: {
		Sentry: true,
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
	},
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'vue/no-v-for-template-key': 'off',
		'vue/no-multiple-template-root': 'off'
	},
	ignorePatterns: ['src/env.d.ts', 'node_modules']
}