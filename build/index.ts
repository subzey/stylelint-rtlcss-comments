import * as fs from 'fs';
import * as path from 'path';

const pkg = JSON.parse(
	fs.readFileSync(
		path.resolve(__dirname, '..', 'package.json'),
		'utf-8'
	)
) as Record<string, unknown>;

// private is used to prevent publishing
pkg.private = true;

fs.writeFileSync(
	path.resolve(__dirname, '..', 'dist', 'package.json'),
	JSON.stringify(pkg, null, 2)
);

fs.copyFileSync(
	path.resolve(__dirname, '..', 'source', 'readme.md'),
	path.resolve(__dirname, '..', 'dist', 'readme.md')
);
