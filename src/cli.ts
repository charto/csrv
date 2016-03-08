// This file is part of csrv, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as path from 'path';
import * as cmd from 'commander';

import {Server} from './Server';

type _ICommand = typeof cmd;
interface ICommand extends _ICommand {
	arguments(spec: string): ICommand;
}

((cmd.version(require('../package.json').version) as ICommand)
	.arguments('<path>')
	.description('Compact development web server')
	.option('-p, --port <port>', 'Bind the server to <port>', '6630')
	.action(handleStart)
	.parse(process.argv)
);

if(process.argv.length < 3) cmd.help();

function handleStart(basePath: string, opts: { [key: string]: any }) {
	basePath = path.resolve('.', basePath);

	new Server(basePath).listen(+opts['port']);
}
