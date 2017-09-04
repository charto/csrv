// This file is part of csrv, copyright (c) 2016-2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as path from 'path';

import { Server } from './Server';

function usage() {
	const pkg = require('../package.json');
	const cwd = process.cwd();

	console.log('\n  ' + pkg.name + ' - ' + pkg.description + ' version ' + pkg.version);
	console.log([
		'\n  Usage:',
		path.relative(cwd, process.argv[0]),
		path.relative(cwd, process.argv[1]),
		'[OPTION]...',
		'DIRECTORY'
	].join(' '));

	console.log('\n  Start HTTP server with public root in DIRECTORY.');
	console.log('\n  Options:');
	console.log('\n    -p, --port=PORT  Bind to given TCP port (default 8080).\n');

	process.exit(1);

	return(new Error());
}

const argc = process.argv.length;

let port = 8080;
let basePath: string | undefined;

let arg: string;

for(let i = 2; i < argc; ++i) {
	arg = process.argv[i];

	const match = arg.match(/^(--?(?:[-0-9A-Za-z]+))(?:=(.+))?/);
	if(match) {
		const key = match[1];
		let val = match[2];

		if(typeof(val) == 'undefined') val = process.argv[++i];

		if(key == '-p' || key == '--port') {
			port = parseInt(val, 10);
			if('' + port != val) throw(usage());
		} else throw(usage());
	} else basePath = arg;
}

if(typeof(basePath) == 'undefined') throw(usage());

basePath = path.resolve('.', basePath);

new Server(basePath).listen(port, (err: NodeJS.ErrnoException) => {
	if(err) {
		if(err.code == 'EACCES' || err.code == 'EADDRINUSE') {
			console.error('Error binding to port ' + port);
			console.error('Try a different one as argument, like npm start -- -p 8080');
		} else console.error(err);
	} else console.log('Serving from ' + basePath + ' on port ' + port);
});
