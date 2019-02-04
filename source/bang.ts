import { createPlugin, utils, LintResult } from 'stylelint';
import { Root, Comment } from 'postcss';

export type PrimaryOption = 'never' | 'always';

const enum Hardcode {
	ruleName = 'rtlcss-comments/bang',
}

const messages: Record<string, string> = utils.ruleMessages(Hardcode.ruleName, {
	expectedBang: 'Expecting rtlcss directive to start with a "!". Use /*!rtl:{directive} instead',
	unexpectedBang: 'Unexpected "!" in a rtlcss directive. Use /*rtl:{directive} instead',
});

const RE_RTLCSS_DIRECTIVE = /^\s*(!?)rtl:(.*)/;

// Looks like typings for createPlugin are incorrect
// tslint:disable-next-line no-any
export const rule = (createPlugin as any)(
	Hardcode.ruleName,
	Object.assign(
		(primaryOption: PrimaryOption) => (root: Root, result: LintResult) => {
			const isValidOptions = utils.validateOptions(result, Hardcode.ruleName, {
				possible: ['never', 'always'],
				actual: primaryOption,
			});
			if (!isValidOptions) {
				return;
			}

			root.walkComments((commentNode: Comment): void => {
				const match = RE_RTLCSS_DIRECTIVE.exec(commentNode.text);
				if (match) {
					if (match[1] && primaryOption === 'never') {
						utils.report({
							ruleName: Hardcode.ruleName,
							result,
							message: messages.unexpectedBang.replace('{directive}', match[2]),
							node: commentNode,
						});
					} else if (!match[1] && primaryOption === 'always') {
						utils.report({
							ruleName: Hardcode.ruleName,
							result,
							message: messages.expectedBang.replace('{directive}', match[2]),
							node: commentNode,
						});
					}
				}
			});
		},
		{
			messages,
			ruleName: Hardcode.ruleName,
		}
	)
);
