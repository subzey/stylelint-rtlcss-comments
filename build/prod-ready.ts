import * as fs from 'fs';
import * as path from 'path';

const whitelist: Set<string> = new Set([
	'name', 'version', 'description', 'keywords',
	'main', 'typings', 'dependencies',
	'author', 'license',
]);

const pkg = JSON.parse(
	fs.readFileSync(
		path.resolve(__dirname, '..', 'dist', 'package.json'),
		'utf-8'
	)
// tslint:disable-next-line no-any
) as Record<string, any>;

// Cleanup unknown or unneeded fields
for (let key of Object.keys(pkg)) {
	if (!whitelist.has(key)) {
		delete pkg[key];
	}
}

fs.writeFileSync(
	path.resolve(__dirname, '..', 'dist', 'package.json'),
	JSON.stringify(pkg, null, 2)
);
