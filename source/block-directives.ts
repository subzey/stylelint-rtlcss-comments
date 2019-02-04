import { createPlugin, utils, LintResult } from 'stylelint';
import { Root, Container, Comment } from 'postcss';

export type PrimaryOption = 'never' | 'wraps-properties';

const enum Hardcode {
	ruleName = 'rtlcss-comments/block-directives',
}

const messages: Record<string, string> = utils.ruleMessages(Hardcode.ruleName, {
	unexpectedDirective: 'Unexpected block rtlcss directive {name}',
	unexpectedWrap: 'Block rtlcss directive {name} should not contain rules or @-rules',
	unexpectedUnclosed: 'Block rtlcss directive {name} should end in the same context where it begins',
});

const RE_RTLCSS_BLOCK_DIRECTIVE = /^\s*(!?)rtl:(begin|end):([^:]*)/;

function checkAnyBlockDirective(root: Root, result: LintResult): void {
	root.walkComments((commentNode: Comment): void => {
		const match = RE_RTLCSS_BLOCK_DIRECTIVE.exec(commentNode.text);
		if (match) {
			utils.report({
				ruleName: Hardcode.ruleName,
				result,
				message: messages.unexpectedDirective.replace('{name}', `${match[2]}:${match[3]}`),
				node: commentNode,
			});
		}
	});
}

interface StartedDirective {
	readonly name: string;
	readonly node: Comment;
	reported: boolean;
}

function checkDirectiveNesting(containerNode: Container, result: LintResult): void {
	const startedDirectives: StartedDirective[] = [];
	for (const childNode of containerNode.nodes || []) {
		if (childNode.type === 'comment') {
			const match = RE_RTLCSS_BLOCK_DIRECTIVE.exec(childNode.text);
			if (!match) {
				continue;
			}
			const ctl = match[2];
			const name = match[3];
			if (ctl === 'begin') {
				// Mark directive as opened
				startedDirectives.push({
					name,
					node: childNode,
					reported: false,
				});
			} else if (ctl === 'end') {
				// Close all (probably incorrectly nested) opened directives with the same name
				for (let i = startedDirectives.length; i-- > 0;) {
					if (startedDirectives[i].name === name) {
						startedDirectives.splice(i, 1);
					}
				}
			}
			continue;
		}

		if (childNode.type === 'decl') {
			// Property declarations are allowed everywhere
			continue;
		}

		// We've encountered something except decl or comment:
		// Report all open directives as invalid (if any)
		for (const directive of startedDirectives) {
			if (!directive.reported) {
				utils.report({
					ruleName: Hardcode.ruleName,
					result,
					message: messages.unexpectedWrap.replace('{name}', directive.name),
					node: directive.node,
				});
				directive.reported = true;
			}

		}

		// Call recursively (depth first)
		checkDirectiveNesting(childNode, result);
	}

	// Report all opened directives after the container (root, rule or @-rule) ends
	for (const directive of startedDirectives) {
		if (!directive.reported) {
			utils.report({
				ruleName: Hardcode.ruleName,
				result,
				message: messages.unexpectedUnclosed.replace('{name}', directive.name),
				node: directive.node,
			});
			directive.reported = true;
		}
	}
}

// Looks like typings for createPlugin are incorrect
// tslint:disable-next-line no-any
export const rule = (createPlugin as any)(
	Hardcode.ruleName,
	Object.assign(
		(primaryOption: PrimaryOption) => (root: Root, result: LintResult) => {
			const isValidOptions = utils.validateOptions(result, Hardcode.ruleName, {
				possible: ['never', 'wraps-properties'],
				actual: primaryOption,
			});
			if (!isValidOptions) {
				return;
			}

			if (primaryOption === 'never') {
				checkAnyBlockDirective(root, result);
			} else if (primaryOption === 'wraps-properties') {
				checkDirectiveNesting(root, result);
			}
		},
		{
			messages,
			ruleName: Hardcode.ruleName,
		}
	)
);
