const testRule = require('stylelint-test-rule-tape');
const blockDirectives = require('../dist/block-directives').rule;
const bang = require('../dist/bang').rule;

testRule(blockDirectives.rule, {
	ruleName: blockDirectives.ruleName,
	config: 'never',
	accept: [
		{code: `.woot { left: 0 }`},
		{code: `/* Harmless comment */ .woot { left: 0 }`},
	],
	reject: [
		{
			code: `/*!rtl:begin:ignore*/ .woot { left: 0; }`,
			message: 'Unexpected block rtlcss directive begin:ignore (rtlcss-comments/block-directives)',
		},
		{
			code: `.woot { /*rtl:end:ignore*/ left: 0; }`,
			message: 'Unexpected block rtlcss directive end:ignore (rtlcss-comments/block-directives)',
		}
	]
});


testRule(blockDirectives.rule, {
	ruleName: blockDirectives.ruleName,
	config: 'wraps-properties',
	accept: [
		{code: `.woot { left: 0 }`},
		{code: `/* Harmless comment */ .woot { left: 0 }`},
		{code: `.woot { /*rtl:begin:ignore*/ left: 0; /*rtl:end:ignore*/ }`},
	],
	reject: [
		{
			code: `.woot { /*rtl:begin:ignore*/ left: 0; }`,
			message: 'Block rtlcss directive ignore should end in the same context where it begins (rtlcss-comments/block-directives)',
		},
		{
			code: `/*rtl:begin:ignore*/ .woot { left: 0; } /*rtl:end:ignore*/`,
			message: 'Block rtlcss directive ignore should not contain rules or @-rules (rtlcss-comments/block-directives)',
		},
	]
});


testRule(bang.rule, {
	ruleName: bang.ruleName,
	config: 'never',
	accept: [
		{code: `.woot { left: 0 }`},
		{code: `/* Harmless comment */ .woot { left: 0 }`},
		{code: `.woot { /*rtl:begin:ignore*/ left: 0; /*rtl:end:ignore*/ }`},
		{code: `.woot { /*rtl:ignore*/ left: 0; }`},
	],
	reject: [
		{
			code: `.woot { /*!rtl:begin:ignore*/ left: 0; /*rtl:end:ignore*/ }`,
			message: 'Unexpected "!" in a rtlcss directive. Use /*rtl:begin:ignore instead (rtlcss-comments/bang)',
		},
		{
			code: `.woot { /*!rtl:ignore*/ left: 0; }`,
			message: 'Unexpected "!" in a rtlcss directive. Use /*rtl:ignore instead (rtlcss-comments/bang)',
		},
	]
});

testRule(bang.rule, {
	ruleName: bang.ruleName,
	config: 'always',
	accept: [
		{code: `.woot { left: 0 }`},
		{code: `/* Harmless comment */ .woot { left: 0 }`},
		{code: `.woot { /*!rtl:begin:ignore*/ left: 0; /*!rtl:end:ignore*/ }`},
		{code: `.woot { /*!rtl:ignore*/ left: 0; }`},
	],
	reject: [
		{
			code: `.woot { /*!rtl:begin:ignore*/ left: 0; /*rtl:end:ignore*/ }`,
			message: 'Expecting rtlcss directive to start with a "!". Use /*!rtl:end:ignore instead (rtlcss-comments/bang)',
		},
		{
			code: `.woot { /*rtl:ignore*/ left: 0; }`,
			message: 'Expecting rtlcss directive to start with a "!". Use /*!rtl:ignore instead (rtlcss-comments/bang)',
		},
	]
});
